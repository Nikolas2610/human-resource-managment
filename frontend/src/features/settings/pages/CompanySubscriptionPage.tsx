import HeaderPageBackFeature from "@/components/ui/HeaderPageBackFeature";
import { selectCompany } from "@/features/auth/authSlice";
import { useGetCompanySubscriptionQuery } from "@/features/companies/companiesEndpoints";
import useToggleDashboardLoading from "@/hooks/useToggleDashboardLoading";
import RouteList from "@/routes/RouteList";
import { convertToDDMMYYYY } from "@/utils/helpers/functions";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { SubscriptionStatus } from "../enum/SubscriptionStatus";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import {
    useCancelSubscriptionMutation,
    useRenewSubscriptionMutation,
} from "../subscriptionEndpoints";
import { useHandleMutation } from "@/hooks/useHandleMutation";
import SubscriptionChip from "../components/SubscriptionChip";
import usePageTitle from "@/hooks/usePageTitle";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import { Link, useNavigate } from "react-router-dom";
import CompleteSubscriptionPaymentButton from "../components/CompleteSubscriptionPaymentButton";

export default function CompanySubscriptionPage() {
    const companyId = useSelector(selectCompany);
    const {
        data: companySubscription = null,
        isLoading,
        isError,
    } = useGetCompanySubscriptionQuery(companyId);
    useToggleDashboardLoading(isLoading);
    usePageTitle("Subscription");
    const navigate = useNavigate();

    const [
        cancelSubscription,
        {
            isLoading: isCancelSubscriptionLoading,
            isError: isCancelSubscriptionError,
            error: cancelSubscriptionError,
            isSuccess: isCancelSubscriptionSuccess,
        },
    ] = useCancelSubscriptionMutation();

    const [
        renewSubscription,
        {
            isLoading: isRenewSubscriptionLoading,
            isError: isRenewSubscriptionError,
            error: renewSubscriptionError,
            isSuccess: isRenewSubscriptionSuccess,
        },
    ] = useRenewSubscriptionMutation();

    useHandleMutation({
        isLoading: isCancelSubscriptionLoading,
        isError: isCancelSubscriptionError,
        error: cancelSubscriptionError,
        isSuccess: isCancelSubscriptionSuccess,
        actionType: "cancelSubscription",
        entityType: "Subscription",
        redirectTo: "",
    });

    useHandleMutation({
        isLoading: isRenewSubscriptionLoading,
        isError: isRenewSubscriptionError,
        error: renewSubscriptionError,
        isSuccess: isRenewSubscriptionSuccess,
        actionType: "renewSubscription",
        entityType: "Subscription",
        redirectTo: "",
    });

    if (isError) {
        return <div>Something went wrong...</div>;
    }

    const handleCancelSubscription = () => {
        if (companySubscription?.status === SubscriptionStatus.ACTIVE) {
            cancelSubscription({ company_id: companyId });
        } else {
            alert("You can't cancel this subscription");
        }
    };

    const handleRenewSubscription = () => {
        if (
            companySubscription?.status === SubscriptionStatus.ACTIVE_TO_CANCEL
        ) {
            renewSubscription({ company_id: companyId });
        } else {
            if (
                companySubscription?.status === SubscriptionStatus.CANCELED ||
                companySubscription?.status ===
                    SubscriptionStatus.INCOMPLETE_EXPIRED
            ) {
                alert("Previous");
            }
        }
    };

    const handleChangeSubscriptionPlan = () => {
        navigate(RouteList.changeSubscriptionPlan);
    };

    if (isLoading) {
        return "Loading...";
    }

    return (
        <>
            <HeaderPageBackFeature
                headerTitle="Subscription"
                to={RouteList.settings}
                buttonTitle="Back to Settings"
            />

            <FlexBetween mt={2}>
                <Link to={RouteList.invoices}>
                    <Button>View Invoices</Button>
                </Link>
                {companySubscription && (
                    <SubscriptionChip status={companySubscription.status} />
                )}
            </FlexBetween>

            {companySubscription && (
                <>
                    <Card sx={{ marginTop: 2 }}>
                        <CardContent>
                            <p>
                                Your company is currently on the{" "}
                                <strong>
                                    {
                                        companySubscription?.subscription_plan
                                            .name
                                    }
                                </strong>{" "}
                                plan.
                            </p>
                            <p>
                                You have register{" "}
                                <strong>
                                    {companySubscription?.employees_count}
                                </strong>{" "}
                                of{" "}
                                <strong>
                                    {
                                        companySubscription?.subscription_plan
                                            .max_users
                                    }
                                </strong>{" "}
                                available employees.
                            </p>
                            {companySubscription.status ===
                                SubscriptionStatus.ACTIVE && (
                                <Typography>
                                    Your subscription will renew on{" "}
                                    {convertToDDMMYYYY(
                                        companySubscription?.expiry_date
                                    )}
                                </Typography>
                            )}
                            {companySubscription.status ===
                                SubscriptionStatus.ACTIVE_TO_CANCEL && (
                                <Typography>
                                    {" "}
                                    Your subscription will expire on{" "}
                                    <strong>
                                        {convertToDDMMYYYY(
                                            companySubscription?.expiry_date
                                        )}
                                    </strong>
                                    .
                                </Typography>
                            )}
                            {companySubscription.status ===
                                SubscriptionStatus.INCOMPLETE && (
                                <Typography>
                                    Your subscription is incomplete. Please
                                    update the payment method.
                                </Typography>
                            )}
                            {companySubscription.status ===
                                SubscriptionStatus.TRIALING && (
                                <Typography>
                                    Your subscription is on trial until{" "}
                                    {convertToDDMMYYYY(
                                        companySubscription?.expiry_date
                                    )}
                                </Typography>
                            )}
                            {companySubscription.status ===
                                SubscriptionStatus.UNPAID && (
                                <Typography>
                                    Your subscription is unpaid. Please update
                                    the payment method.
                                </Typography>
                            )}
                            {companySubscription.status ===
                                SubscriptionStatus.INCOMPLETE_EXPIRED && (
                                <Typography>
                                    Your subscription is expired. Please update
                                    the payment method.
                                </Typography>
                            )}
                            {companySubscription.status ===
                                SubscriptionStatus.CANCELED && (
                                <Typography>
                                    Your subscription is canceled. Please choose
                                    a new plan.
                                </Typography>
                            )}
                            {companySubscription.status ===
                                SubscriptionStatus.PAST_DUE && (
                                <Typography>
                                    Your subscription is pending for the
                                    payment. Please update the payment method.
                                    Your current subscription will expire on{" "}
                                    {convertToDDMMYYYY(
                                        companySubscription?.expiry_date
                                    )}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                    <FlexCenter mt={4} gap={4}>
                        {companySubscription.status ===
                            SubscriptionStatus.ACTIVE && (
                            <Button
                                variant="contained"
                                color="error"
                                sx={{ width: 200 }}
                                onClick={handleCancelSubscription}
                            >
                                Cancel Subscription
                            </Button>
                        )}

                        {(companySubscription.status ===
                            SubscriptionStatus.ACTIVE ||
                            companySubscription.status ===
                                SubscriptionStatus.TRIALING ||
                            companySubscription.status ===
                                SubscriptionStatus.ACTIVE_TO_CANCEL ||
                            companySubscription.status ===
                                SubscriptionStatus.CANCELED ||
                            companySubscription.status ===
                                SubscriptionStatus.INCOMPLETE_EXPIRED) && (
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ width: 200 }}
                                onClick={handleChangeSubscriptionPlan}
                            >
                                Change Plan
                            </Button>
                        )}

                        {(companySubscription.status ===
                            SubscriptionStatus.CANCELED ||
                            companySubscription.status ===
                                SubscriptionStatus.INCOMPLETE_EXPIRED ||
                            companySubscription.status ===
                                SubscriptionStatus.ACTIVE_TO_CANCEL) && (
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ width: 200 }}
                                onClick={handleRenewSubscription}
                            >
                                Renew Subscription
                            </Button>
                        )}

                        <CompleteSubscriptionPaymentButton
                            companyId={companyId}
                            status={companySubscription.status}
                        />
                    </FlexCenter>
                </>
            )}
        </>
    );
}
