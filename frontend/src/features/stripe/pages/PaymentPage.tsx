import { Button, Stack, TextField, useTheme } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);

export default function PaymentPage() {
    const [key, setKey] = useState<string>("");
    const theme = useTheme();

    const handlePaymentRedirect = async () => {
        // Make sure to call `loadStripe` outside of a component’s render to avoid
        // recreating the `Stripe` object on every render.
        const stripe = await stripePromise;

        if (!stripe) {
            // Handle error when stripe is null
            console.error("Failed to load Stripe");
            return;
        }

        const result = await stripe.redirectToCheckout({
            sessionId: key,
        });

        if (result.error) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer.
            alert(result.error.message);
        }
    };


    return (
        <>
            <TextField
                variant="outlined"
                label="Key"
                placeholder="Key"
                fullWidth
                value={key}
                onChange={(e) => setKey(e.target.value)}
            />
            <Button
                variant="contained"
                sx={{ mt: 4 }}
                onClick={handlePaymentRedirect}
            >
                Pay
            </Button>
        </>
    );
}
