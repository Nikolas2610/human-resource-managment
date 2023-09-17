import FlexCenter from "../../../components/ui/wrappers/FlexCenter";
import {
    Box,
    Paper,
    TextField,
    Typography,
    Button,
    useTheme,
    Alert,
} from "@mui/material";
import { useForgotPasswordMutation } from "../../api/apiService";
import { LoginError } from "../../../types/api/auth/login/LoginError.type";
import { toggleDashboardLoading } from "../../dashboard/dashboardSlice";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import RouteList from "@/routes/RouteList";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import { useHandleMutation } from "@/hooks/useHandleMutation";

interface FetchBaseQueryError {
    data: {
        errors: LoginError;
        message?: string;
    };
    status: number;
}

interface FormData {
    email: string;
}

function ForgotPasswordPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    const [forgotPassword, { isLoading, error, isError, isSuccess }] =
        useForgotPasswordMutation();
    const theme = useTheme();
    toggleDashboardLoading(isLoading);

    const onSubmit = async (data: FormData) => {
        console.log(data);
        forgotPassword(data.email);
    };

    useHandleMutation({
        isLoading,
        isError,
        error,
        isSuccess,
        actionType: "forgotPassword",
        entityType: "Email ",
        redirectTo: "",
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
                    Forgot Password
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box mb={3}>
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
                    </Box>

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

                <FlexBetween>
                    <Link to={RouteList.register}>
                        <Typography
                            variant="h6"
                            sx={{
                                transition: ".3s",
                                marginTop: 4,
                                width: "fit-content",
                                textDecoration: "underline",
                                cursor: "pointer",
                                "&:hover": {
                                    color: theme.palette.primary.main,
                                },
                            }}
                        >
                            Didn't have already account yet?
                        </Typography>
                    </Link>
                </FlexBetween>
            </Paper>
        </FlexCenter>
    );
}

export default ForgotPasswordPage;
