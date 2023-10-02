import SelectField from "@/components/ui/form/SelectField";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import { useRegisterCompanyMutation } from "@/features/api/apiService";
import RouteList from "@/routes/RouteList";
import { CompanyRegister } from "@/types/api/auth/register/CompanyRegister.type";
import {
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    Alert,
    useTheme,
    Grid,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { generateRequiredErrorMessage } from "@/utils/functions";
import { TogglePasswordField } from "@/components/ui/form/TogglePasswordField";
import { toMysqlFormat } from "@/utils/helpers/functions";
import { useHandleMutation } from "@/hooks/useHandleMutation";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import SwitchTwoValues from "@/components/ui/SwitchTwoValues";
import {
    getSubscriptionPlanId,
    subscriptionPlans,
} from "@/features/website/data/subscriptionPlans";
import { SubscriptionPlanName } from "@/types/subscriptions/SubscriptionPlanName.enum";
import { SubscriptionPlanDuration } from "@/types/subscriptions/SubscriptionPlanDuration.enum";
import { setToken, setUser } from "../authSlice";
import { useDispatch } from "react-redux";
import useStripePaymentRedirect from "@/hooks/useStripePaymentRedirect";

interface FetchBaseQueryError {
    data: {
        errors: any;
        message?: string;
    };
    status: number;
}

const selectDepartments = [
    { title: "Management", id: "Management" },
    {
        title: "Human Resource",
        id: "Human Resource",
    },
    { title: "IT", id: "IT" },
];

const selectPosition = [
    { title: "CEO", id: "CEO" },
    { title: "HR", id: "HR" },
    { title: "CTO", id: "CTO" },
];

export default function RegisterPage() {
    const theme = useTheme();
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<CompanyRegister>();
    const [registerCompany, { isError, isSuccess, error, isLoading, data }] =
        useRegisterCompanyMutation();
    const passwordRef = useRef({});
    const [subscriptionPlan, setSubscriptionPlan] =
        useState<SubscriptionPlanName>(SubscriptionPlanName.PRO);
    const [isYearly, setIsYearly] = useState(false);
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const packageParam = searchParams.get("package");
        const durationParam = searchParams.get("duration");

        if (packageParam) {
            setSubscriptionPlan(packageParam as SubscriptionPlanName);
        }

        if (durationParam) {
            setIsYearly(durationParam === "yearly");
        }
    }, [searchParams]);

    const onSubmit = async (data: CompanyRegister) => {
        const { work_start_date } = data;
        const subscriptionPlanId = getSubscriptionPlanId(
            subscriptionPlan,
            isYearly
                ? SubscriptionPlanDuration.YEARLY
                : SubscriptionPlanDuration.MONTHLY
        );

        if (work_start_date) {
            const mysqlStartDate = toMysqlFormat(work_start_date.toISOString());

            const formattedData = {
                ...data,
                work_start_date: mysqlStartDate,
                subscription_plan_id: subscriptionPlanId,
            } as unknown as CompanyRegister;

            registerCompany(formattedData);
        }
    };

    useStripePaymentRedirect(data, isSuccess);

    useEffect(() => {
        if (
            data &&
            data?.message === "Subscription session created successfully." &&
            data?.session_id
        ) {
            dispatch(setUser(data?.employee));
            dispatch(setToken(data?.token));
        }
    }, [data]);

    useHandleMutation({
        isError,
        isSuccess,
        isLoading,
        error,
        entityType: "Company",
        actionType: "store",
        redirectTo: null,
    });

    function isFetchBaseQueryError(error: any): error is FetchBaseQueryError {
        return error && "data" in error;
    }

    const handleSubscriptionPlanChange = (
        _event: any,
        value: SubscriptionPlanName | null
    ) => {
        if (value) {
            setSubscriptionPlan(value);
        }
    };

    return (
        <FlexCenter height={"100%"} border={1}>
            <Paper
                sx={{
                    padding: 5,
                    width: 700,
                    borderRadius: 4,
                    backgroundColor: theme.palette.background.default,
                }}
                elevation={2}
            >
                <Typography
                    align="center"
                    variant="h1"
                    fontWeight={700}
                    padding={5}
                >
                    Register
                </Typography>

                <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
                    <Typography variant="h3" mb={3}>
                        Company Details
                    </Typography>
                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} md={6} mb={{ xs: 1, md: 0 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Company name"
                                type="text"
                                {...register("name", {
                                    required:
                                        generateRequiredErrorMessage("Name"),
                                })}
                                error={Boolean(errors.name)}
                                helperText={errors.name?.message}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Company Email"
                                type="text"
                                {...register("email_company", {
                                    required:
                                        generateRequiredErrorMessage(
                                            "Username"
                                        ),
                                })}
                                error={Boolean(errors.email_company)}
                                helperText={errors.email_company?.message}
                                disabled={isLoading}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h3" mb={3}>
                        User Details
                    </Typography>
                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} md={6} mb={{ xs: 1, md: 0 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="First Name"
                                type="text"
                                {...register("first_name", {
                                    required:
                                        generateRequiredErrorMessage(
                                            "First name"
                                        ),
                                })}
                                error={Boolean(errors.first_name)}
                                helperText={errors.first_name?.message}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Last Name"
                                type="text"
                                {...register("last_name", {
                                    required:
                                        generateRequiredErrorMessage(
                                            "Last name"
                                        ),
                                })}
                                error={Boolean(errors.last_name)}
                                helperText={errors.last_name?.message}
                                disabled={isLoading}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} md={6} mb={{ xs: 1, md: 0 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Phone"
                                type="text"
                                {...register("phone", {
                                    required:
                                        generateRequiredErrorMessage("Phone"),
                                })}
                                error={Boolean(errors.phone)}
                                helperText={errors.phone?.message}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Address"
                                type="text"
                                {...register("address", {
                                    required:
                                        generateRequiredErrorMessage("Address"),
                                })}
                                error={Boolean(errors.address)}
                                helperText={errors.address?.message}
                                disabled={isLoading}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} md={6} mb={{ xs: 1, md: 0 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Email"
                                type="email"
                                {...register("email", {
                                    required:
                                        generateRequiredErrorMessage("Email"),
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                        message: "Invalid email address",
                                    },
                                })}
                                error={Boolean(errors.email)}
                                helperText={errors.email?.message}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Controller
                                    name="work_start_date"
                                    control={control}
                                    defaultValue={null}
                                    rules={{
                                        required: "Start date is required",
                                    }}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Work Start Date"
                                            disabled={isLoading}
                                            value={field.value}
                                            format="DD-MM-YYYY"
                                            onChange={(newValue) => {
                                                field.onChange(newValue);
                                                setValue(
                                                    "work_start_date",
                                                    newValue
                                                );
                                            }}
                                            slotProps={{
                                                textField: {
                                                    variant: "outlined",
                                                    error: Boolean(
                                                        errors?.work_start_date
                                                    ),
                                                    helperText:
                                                        errors?.work_start_date
                                                            ?.message,
                                                },
                                            }}
                                            sx={{ width: "100%" }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} md={6} mb={{ xs: 1, md: 0 }}>
                            <SelectField
                                name="department_title"
                                control={control}
                                rules={{ required: "Department is required" }}
                                options={selectDepartments}
                                getOptionLabel={(option) => option.title}
                                getOptionValue={(option) => option.id}
                                label="Department"
                                isDisabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <SelectField
                                name="position_title"
                                control={control}
                                rules={{ required: "Position is required" }}
                                options={selectPosition}
                                getOptionLabel={(option) => option.title}
                                getOptionValue={(option) => option.id}
                                label="Position"
                                isDisabled={isLoading}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} md={6} mb={{ xs: 1, md: 0 }}>
                            <TogglePasswordField
                                control={control}
                                name="password"
                                label="Password"
                                placeholder="Enter your password"
                                rules={{
                                    required:
                                        generateRequiredErrorMessage(
                                            "Password"
                                        ),
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Password must have at least 8 characters",
                                    },
                                    maxLength: {
                                        value: 24,
                                        message:
                                            "Password can't be longer than 24 characters",
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8,24}$/,
                                        message:
                                            "Password must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character",
                                    },
                                }}
                                errorObject={errors}
                                onChange={(e) => {
                                    passwordRef.current = e.target.value;
                                }}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TogglePasswordField
                                control={control}
                                name="password_confirmation"
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                rules={{
                                    required:
                                        generateRequiredErrorMessage(
                                            "Confirm Password"
                                        ),
                                    validate: (value: string) =>
                                        value === passwordRef.current ||
                                        "The passwords do not match",
                                }}
                                errorObject={errors}
                                disabled={isLoading}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h3" mb={3}>
                        Subscription Plan
                    </Typography>
                    <FlexBetween>
                        <Box>
                            <ToggleButtonGroup
                                value={subscriptionPlan}
                                exclusive
                                onChange={handleSubscriptionPlanChange}
                                aria-label="subscription plan"
                                sx={{
                                    justifyContent: "center",
                                }}
                            >
                                <ToggleButton value="basic" aria-label="basic">
                                    Basic
                                </ToggleButton>
                                <ToggleButton value="pro" aria-label="pro">
                                    Pro
                                </ToggleButton>
                                <ToggleButton
                                    value="enterprise"
                                    aria-label="enterprise"
                                >
                                    Enterprise
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        <Box>
                            <SwitchTwoValues
                                value={isYearly}
                                onChange={() => setIsYearly((prev) => !prev)}
                                leftText={"Monthly"}
                                rightText={"Yearly"}
                            />
                        </Box>
                    </FlexBetween>
                    <Typography mt={2}>
                        Price:{" "}
                        {
                            subscriptionPlans.find(
                                (plan) =>
                                    plan.title.toLocaleLowerCase() ===
                                    subscriptionPlan
                            )?.price[isYearly ? "yearly" : "monthly"]
                        }
                        €{isYearly ? " yearly" : " monthly"}
                    </Typography>

                    <Box textAlign={"center"} mt={6}>
                        <Button
                            variant="contained"
                            size="large"
                            type="submit"
                            disabled={isLoading}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>

                {isError && isFetchBaseQueryError(error) && (
                    <Box pt={4}>
                        <Alert severity="error">{error.data.message}</Alert>
                    </Box>
                )}

                <Link to={RouteList.login}>
                    <Typography
                        variant="h6"
                        sx={{
                            transition: ".3s",
                            marginTop: 4,
                            width: "fit-content",
                            textDecoration: "underline",
                            cursor: "pointer",
                            "&:hover": { color: theme.palette.primary.main },
                        }}
                    >
                        Did you have already account?
                    </Typography>
                </Link>
            </Paper>
        </FlexCenter>
    );
}
