import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);

type SessionData = {
    session_id?: string;
    message?: string;
};

const useStripePaymentRedirect = (
    data: SessionData | null | undefined,
    isSuccess: boolean
) => {
    const handlePaymentRedirect = async (sessionId: string) => {
        const stripe = await stripePromise;

        if (!stripe) {
            console.error("Failed to load Stripe");
            return;
        }

        const result = await stripe.redirectToCheckout({
            sessionId,
        });

        if (result.error) {
            // TODO: Better error handling UI
            alert(result.error.message);
        }
    };

    useEffect(() => {
        if (isSuccess && data?.session_id) {
            handlePaymentRedirect(data.session_id);
        }
    }, [data, isSuccess]);
};

export default useStripePaymentRedirect;
