import { SubscriptionStatus } from "../enum/SubscriptionStatus";
import CompleteStripeSubscriptionPaymentButton from "@/components/CompleteStripeSubscriptionPaymentButton";

export default function CompleteSubscriptionPaymentButton({
    status,
    companyId,
}: CompleteSubscriptionPaymentButtonProps) {
    return (
        <>
            {(status === SubscriptionStatus.PAST_DUE ||
                status === SubscriptionStatus.INCOMPLETE ||
                status === SubscriptionStatus.UNPAID) && (
                <CompleteStripeSubscriptionPaymentButton
                    companyId={companyId}
                />
            )}
        </>
    );
}

interface CompleteSubscriptionPaymentButtonProps {
    status: SubscriptionStatus;
    companyId: number;
}
