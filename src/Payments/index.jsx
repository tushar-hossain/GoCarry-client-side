import { Elements } from "@stripe/react-stripe-js";
import PaymentsForm from "./Components";
import { loadStripe } from "@stripe/stripe-js";

const stripPromise = loadStripe(import.meta.env.VITE_strip_public_key);

export default function Payments() {
  return (
    <div>
      <Elements stripe={stripPromise}>
        <PaymentsForm />
      </Elements>
    </div>
  );
}
