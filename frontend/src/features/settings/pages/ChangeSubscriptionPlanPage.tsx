import { useState } from "react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Grid,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    useTheme,
    Box,
} from "@mui/material";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import RouteList from "@/routes/RouteList";
import {
    getSubscriptionPlanId,
    subscriptionPlans,
} from "@/features/website/data/subscriptionPlans";
import HeaderPageBackFeature from "@/components/ui/HeaderPageBackFeature";
import { selectCompany } from "@/features/auth/authSlice";
import { useGetCompanySubscriptionQuery } from "@/features/companies/companiesEndpoints";
import { useDispatch, useSelector } from "react-redux";
import { SubscriptionPlanDuration } from "@/types/subscriptions/SubscriptionPlanDuration.enum";
import { capitalizeFirstLetter } from "@/utils/helpers/functions";
import { SubscriptionPlanName } from "@/types/subscriptions/SubscriptionPlanName.enum";
import { useChangeSubscriptionMutation } from "../subscriptionEndpoints";
import { useHandleMutation } from "@/hooks/useHandleMutation";
import { setSnackbar } from "@/features/snackbars/snackbarSlice";
import { SnackBarSeverity } from "@/features/snackbars/enums/SnackBarSeverity.enum";

const ChangeSubscriptionPlanPage = () => {
    const [billing, setBilling] = useState("monthly");
    const theme = useTheme();
    const companyId = useSelector(selectCompany);
    const {
        data: companySubscription = null,
        isLoading,
        isError,
    } = useGetCompanySubscriptionQuery(companyId);
    const dispatch = useDispatch();
    const [
        changeSubscription,
        {
            isLoading: isChangeSubscriptionLoading,
            isError: isChangeSubscriptionError,
            error: changeSubscriptionError,
            isSuccess: isChangeSubscriptionSuccess,
        },
    ] = useChangeSubscriptionMutation();

    useHandleMutation({
        isLoading: isChangeSubscriptionLoading,
        isError: isChangeSubscriptionError,
        error: changeSubscriptionError,
        isSuccess: isChangeSubscriptionSuccess,
        actionType: "update",
        entityType: "Subscription",
        redirectTo: RouteList.subscription,
    });

    const handleBillingChange = (_event: any, newBilling: string) => {
        if (newBilling !== null) {
            setBilling(newBilling);
        }
    };

    const handleChangePlan = (packageTitle: SubscriptionPlanName) => {
        const subscriptionPlanId = getSubscriptionPlanId(
            packageTitle,
            billing === SubscriptionPlanDuration.MONTHLY
                ? SubscriptionPlanDuration.MONTHLY
                : SubscriptionPlanDuration.YEARLY
        );

        // Check if user is already subscribed to this plan
        if (subscriptionPlanId === companySubscription?.subscription_plan.id) {
            dispatch(
                setSnackbar({
                    message: "You are already subscribed to this plan",
                    severity: SnackBarSeverity.WARNING,
                })
            );
            return;
        }

        // Confirm before changing subscription
        if (confirm("Are you sure you want to change your subscription?")) {
            changeSubscription({
                company_id: companyId,
                subscription_plan_id: subscriptionPlanId,
            });
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Something went wrong</div>;
    }

    return (
        <>
            <HeaderPageBackFeature
                headerTitle="Choose Your Plan"
                buttonTitle={"Back to  your Subscription"}
                to={RouteList.subscription}
            />
            <Box
                bgcolor={theme.palette.background.paper}
                mt={4}
                p={4}
                py={10}
                borderRadius={4}
                display={"flex"}
                alignItems={"center"}
            >
                <Container maxWidth="md">
                    <Typography
                        variant="h1"
                        align="center"
                        gutterBottom
                        color={"white"}
                    >
                        Change Your Plan
                    </Typography>

                    <FlexCenter my={4}>
                        <ToggleButtonGroup
                            value={billing}
                            exclusive
                            onChange={handleBillingChange}
                            aria-label="billing"
                            sx={{ justifyContent: "center", marginBottom: 2 }}
                        >
                            <ToggleButton value="monthly" aria-label="monthly">
                                Monthly
                            </ToggleButton>
                            <ToggleButton value="yearly" aria-label="yearly">
                                Yearly
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </FlexCenter>

                    <Grid container spacing={3}>
                        {subscriptionPlans.map((pkg) => (
                            <Grid item xs={12} sm={4} key={pkg.title}>
                                <Card>
                                    <CardHeader
                                        title={capitalizeFirstLetter(pkg.title)}
                                        titleTypographyProps={{
                                            align: "center",
                                        }}
                                        subheaderTypographyProps={{
                                            align: "center",
                                        }}
                                        subheader={
                                            billing === "yearly"
                                                ? `$${pkg.price.yearly} / year`
                                                : `$${pkg.price.monthly} / month`
                                        }
                                        sx={{
                                            background:
                                                "linear-gradient(60deg, #ab47bc, #8e24aa)",
                                            color: "white",
                                        }}
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="h4"
                                            align="center"
                                            fontWeight={700}
                                            gutterBottom
                                        >
                                            Features
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            align="center"
                                            gutterBottom
                                        >
                                            {pkg.users}
                                        </Typography>
                                        <Button
                                            sx={{ mt: 2 }}
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={() =>
                                                handleChangePlan(pkg.title)
                                            }
                                        >
                                            Change Plan
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
            <Box
                bgcolor={theme.palette.background.paper}
                mt={4}
                p={4}
                borderRadius={4}
                display={"flex"}
                alignItems={"center"}
            >
                <Typography>Your current plan is:</Typography>
                <Box ml={1}>
                    <Typography color={"primary"}>
                        {companySubscription?.subscription_plan.name}
                    </Typography>
                </Box>
                <Box ml={1}>
                    <Typography>per</Typography>
                </Box>
                <Box ml={1}>
                    <Typography color={"primary"}>
                        {companySubscription?.subscription_plan.duration}
                    </Typography>
                </Box>
            </Box>
        </>
    );
};

export default ChangeSubscriptionPlanPage;
