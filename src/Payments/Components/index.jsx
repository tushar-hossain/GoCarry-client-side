import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";

export default function PaymentsForm() {
  const stripe = useStripe();
  const element = useElements();
  const [error, setError] = useState("");
  const { id } = useParams();
  const axioSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    isPending,
    isError,
    data: parcels = [],
  } = useQuery({
    queryKey: ["parcels", id],
    queryFn: async () => {
      const result = await axioSecure(`/parcels/${id}`);
      return result;
    },
  });

  // LOADING
  if (isPending) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-[#71717A]">Loading parcels...</p>
      </div>
    );
  }

  // ERROR
  if (isError) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-red-500">
          {error?.message || "Failed to load parcels"}
        </p>
      </div>
    );
  }

  const parcelCost = parcels?.data?.data.deliveryCost * 100;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !element) {
      return;
    }

    const card = element.getElement(CardElement);

    if (card === "null") {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("");

      // 1. Create PaymentIntent
      try {
        const response = await axioSecure.post(
          "/payments/create-payment-intent",
          {
            amount: parcelCost,
          },
        );

        const clientSecret = response.data.clientSecret;

        // 2. Confirm payment
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card,
          },
        });

        if (result.error) {
          setError(result.error.message);
          return;
        }

        if (result.paymentIntent?.status === "succeeded") {
          // TODO:
          // update parcel payment status
          // save transaction/payment information
          // generate tracking ID
        }
      } catch (error) {
        setError(
          error?.response?.data?.message ||
            "Something went wrong while processing payment.",
        );
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#03373D]">Payment Now</h2>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Card */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#18181B]">
              Card Information
            </label>

            <div className="rounded-lg border border-[#D9E0E5] bg-white px-4 py-3 transition focus-within:border-[#067A87] focus-within:ring-2 focus-within:ring-[#067A87]/10">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "14px",
                      color: "#18181B",
                      fontFamily: "Inter, sans-serif",
                      "::placeholder": {
                        color: "#A1A1AA",
                      },
                    },
                    invalid: {
                      color: "#DC2626",
                    },
                  },
                }}
              />
            </div>

            {/* Stripe Error */}
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          </div>

          {/* Payment Button */}
          <button
            type="submit"
            disabled={!stripe}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#CAEB66] text-sm font-semibold text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Pay Now ${parcels?.data?.data.deliveryCost}
          </button>
        </form>
      </div>
    </div>
  );
}
