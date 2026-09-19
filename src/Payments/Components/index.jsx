import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import LoadingSpinner from "@/Pages/Shared/Loading";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { Check, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";

const testCards = [
  {
    number: "4242424242424242",
    brand: "Visa",
    description: "Payment succeeds",
  },
  {
    number: "4000056655665556",
    brand: "Visa",
    description: "Payment succeeds",
  },
  {
    number: "5555555555554444",
    brand: "Mastercard",
    description: "Payment succeeds",
  },
  {
    number: "378282246310005",
    brand: "American Express",
    description: "Payment succeeds",
  },
];

export default function PaymentsForm() {
  const stripe = useStripe();
  const element = useElements();
  const [error, setError] = useState("");
  const { id } = useParams();
  const axioSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedCard, setCopiedCard] = useState("");

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
    return <LoadingSpinner />;
  }

  // ERROR
  if (isError) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-sm text-red-500">
          {error?.message || "Failed to load parcels"}
        </p>
      </div>
    );
  }

  const parcelCost = parcels?.data?.data.deliveryCost * 100;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !element || isProcessing) {
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      const card = element.getElement(CardElement);

      if (!card) {
        setError("Please enter your card information.");
        return;
      }

      // 1. Create Payment Method
      const { error: paymentMethodError } = await stripe.createPaymentMethod({
        type: "card",
        card,
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message);
        return;
      }

      // 2. Create Payment Intent
      const response = await axioSecure.post(
        "/payments/create-payment-intent",
        {
          amount: parcelCost,
        },
      );

      const clientSecret = response.data.clientSecret;

      // 3. Confirm Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
        },
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      // 4. Payment successful
      if (result.paymentIntent?.status === "succeeded") {
        const paymentData = {
          paymentIntentId: result.paymentIntent.id,
          parcelId: parcels?.data?.data?._id,
          status: result.paymentIntent.status,
          user: user?.displayName || "",
        };

        // 5. payment information Save database
        const saveResponse = await axioSecure.post(
          "/payments/save-payment",
          paymentData,
        );

        const paymentResult = saveResponse.data.data;

        if (paymentResult?.paymentStatus === "succeeded") {
          const swalResult = await Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            html: `
            <div style="text-align: left; margin-top: 15px;">
              <p style="margin-bottom: 8px;">
                <strong>Payment Status:</strong>
                ${paymentResult.paymentStatus}
              </p>

              <p style="margin-bottom: 8px;">
                <strong>Tracking ID:</strong>
                ${paymentResult.trackingId}
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

          if (swalResult.isConfirmed) {
            navigate("/dashboard/myParcel");
          }
        }
      }
    } catch (error) {
      console.error("Payment error:", error);

      setError(
        error?.response?.data?.message ||
          "Something went wrong while processing payment.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyCard = async (cardNumber) => {
    try {
      await navigator.clipboard.writeText(cardNumber);
      setCopiedCard(cardNumber);
      setTimeout(() => {
        setCopiedCard("");
      }, 1500);
    } catch (error) {
      console.error("Failed to copy card number:", error);
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
            disabled={!stripe || isProcessing}
            className="flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#CAEB66] text-sm font-semibold text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay Now $${parcels?.data?.data?.deliveryCost}`
            )}
          </button>
        </form>
      </div>
      {/* Test Cards */}
      <div className="mt-6 border-t border-[#E5E7EB] pt-5">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-[#03373D]">
            Test Card Numbers
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {testCards.map((card) => (
            <div
              key={card.number}
              className="flex items-center justify-between gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFA] px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs font-medium text-[#18181B]">
                  {card.number}
                </p>

                <p className="mt-0.5 text-[9px] text-[#71717A]">{card.brand}</p>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCard(card.number)}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#D9E0E5] bg-white text-[#71717A] transition hover:bg-[#F4F4F5] hover:text-[#03373D]"
                title="Copy card number"
              >
                {copiedCard === card.number ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
