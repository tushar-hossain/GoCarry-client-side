import { Elements } from "@stripe/react-stripe-js";
import PaymentsForm from "./Components";
import { loadStripe } from "@stripe/stripe-js";

const stripPromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");

export default function Payments() {
  return (
    <div>
      <Elements stripe={stripPromise}>
        <PaymentsForm />
      </Elements>
    </div>
  );
}
