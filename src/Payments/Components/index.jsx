import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";

export default function PaymentsForm() {
  const stripe = useStripe();
  const element = useElements();
  const [error, setError] = useState("");
  const { id } = useParams();
  const axioSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

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

    const { error } = await stripe.createPaymentMethod({
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
          const paymentData = {
            paymentIntentId: result.paymentIntent.id,
            parcelId: parcels?.data?.data._id,
            status: result.paymentIntent.status,
            user: user?.displayName || "",
          };

          const response = await axioSecure.post(
            "/payments/save-payment",
            paymentData,
          );

          const paymentResult = response.data.data;

          if (paymentResult?.paymentStatus === "succeeded") {
            const result = await Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              html: `
                      <div style="text-align: left; margin-top: 15px;">
                        <p style="margin-bottom: 8px;">
                          <strong>Payment Status:</strong> ${paymentResult.paymentStatus}
                        </p>

                        <p style="margin-bottom: 8px;">
                          <strong>Tracking ID:</strong> ${paymentResult.trackingId}
                        </p>

                        <p style="color: #71717A; font-size: 13px;">
                          Your parcel payment has been completed successfully.
                        </p>
                      </div>
                    `,
              confirmButtonText: "Go to My Parcels",
              confirmButtonColor: "#CAEB66",
              allowOutsideClick: false,
            });

            if (result.isConfirmed) {
              navigate("/dashboard/myParcel");
            }
          }
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
