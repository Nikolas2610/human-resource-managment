import { Button } from "@mui/material";
import { useHandleServerError } from "@/hooks/useHandleServerError";
import useToggleDashboardLoading from "@/hooks/useToggleDashboardLoading";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import useStripePaymentRedirect from "@/hooks/useStripePaymentRedirect";
import { useUpdatePaymentSubscriptionMutation } from "@/features/settings/subscriptionEndpoints";

export default function CompleteStripeSubscriptionPaymentButton({
    text = "Update Payment Method",
    companyId,
}: CompleteStripeSubscriptionPaymentButtonProps) {
    const [
        updatePaymentSubscription,
        {
            data: updatePaymentSubscriptionData,
            isLoading: isUpdatePaymentPaymentLoading,
            isError: isUpdatePaymentPaymentError,
            error: updatePaymentPaymentError,
            isSuccess: isUpdatePaymentPaymentSuccess,
        },
    ] = useUpdatePaymentSubscriptionMutation();

    useHandleServerError(
        isUpdatePaymentPaymentError,
        updatePaymentPaymentError
    );
    useToggleDashboardLoading(isUpdatePaymentPaymentLoading);
    useStripePaymentRedirect(
        updatePaymentSubscriptionData,
        isUpdatePaymentPaymentSuccess
    );

    const handleCompletePayment = () => {
        updatePaymentSubscription({ company_id: companyId });
    };

    return (
        <Button
            variant="contained"
            color="warning"
            onClick={handleCompletePayment}
            startIcon={<CreditCardIcon />}
        >
            {text}
        </Button>
    );
}

interface CompleteStripeSubscriptionPaymentButtonProps {
    text?: string;
    companyId: number;
}
