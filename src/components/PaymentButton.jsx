import { loadStripe } from "@stripe/stripe-js";
import API from "../services/api";

const stripePromise = loadStripe("YOUR_STRIPE_PUBLISHABLE_KEY");

function PaymentButton({ reservationId, price }) {

  const handlePayment = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/payments/create-checkout-session",
        { reservationId, price },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const stripe = await stripePromise;

      await stripe.redirectToCheckout({
        sessionId: res.data.sessionId
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold"
    >
      Pay Now
    </button>
  );
}

export default PaymentButton;