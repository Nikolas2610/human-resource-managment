import FlexCenter from "../../../components/ui/wrappers/FlexCenter";
import {
    Box,
    Paper,
    TextField,
    Typography,
    Button,
    useTheme,
    Alert,
    Stack,
} from "@mui/material";
import { useResetPasswordMutation } from "../../api/apiService";
import { LoginError } from "../../../types/api/auth/login/LoginError.type";
import { toggleDashboardLoading } from "../../dashboard/dashboardSlice";
import { useForm } from "react-hook-form";
import { useHandleMutation } from "@/hooks/useHandleMutation";
import { TogglePasswordField } from "@/components/ui/form/TogglePasswordField";
import { generateRequiredErrorMessage } from "@/utils/functions";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RouteList from "@/routes/RouteList";

interface FetchBaseQueryError {
    data: {
        errors: LoginError;
        message?: string;
    };
    status: number;
}

interface FormData {
    email: string;
    password: string;
    password_confirmation: string;
}

function ResetPasswordPage() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>();
    const [resetPassword, { isLoading, error, isError, isSuccess }] =
        useResetPasswordMutation();
    const theme = useTheme();
    const passwordRef = useRef(null);
    const [token, setToken] = useState("testa");
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get("token");
    const navigate = useNavigate();

    toggleDashboardLoading(isLoading);

    useEffect(() => {
      console.log(urlToken);
      
        if (urlToken) {
            setToken(urlToken);
        } else {
            // navigate(RouteList.login);
        }
    }, [urlToken]);

    const onSubmit = async (data: FormData) => {
        const formattedData = {
            ...data,
            token,
        };
        resetPassword(formattedData);
    };

    useHandleMutation({
        isLoading,
        isError,
        error,
        isSuccess,
        actionType: "resetPassword",
        entityType: "Password",
        redirectTo: RouteList.login,
    });

    function isFetchBaseQueryError(error: any): error is FetchBaseQueryError {
        return error && "data" in error;
    }

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
                    Reset Password
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack mb={3} spacing={2}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: "invalid email address",
                                },
                            })}
                            error={!!errors.email}
                            helperText={
                                errors.email ? errors.email.message : null
                            }
                        />
                        <TogglePasswordField
                            control={control}
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            rules={{
                                required:
                                    generateRequiredErrorMessage("Password"),
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
                        />
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
                        />
                    </Stack>

                    <Box textAlign={"center"} mt={6}>
                        <Button variant="contained" size="large" type="submit">
                            Submit
                        </Button>
                    </Box>
                </form>

                {isError && isFetchBaseQueryError(error) && (
                    <Box pt={4}>
                        <Alert severity="error">{error.data.message}</Alert>
                    </Box>
                )}
            </Paper>
        </FlexCenter>
    );
}

export default ResetPasswordPage;
