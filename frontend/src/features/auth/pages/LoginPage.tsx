import { useDispatch, useSelector } from "react-redux";
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
import { useLoginMutation } from "../../api/apiService";
import { RootState } from "../../../app/store";
import { useEffect } from "react";
import { LoginError } from "../../../types/api/auth/login/LoginError.type";
import { setLoading } from "../../dashboard/dashboardSlice";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LoginSchema } from "../../../utils/validation/auth/LoginSchema";
import { loginUser } from "../authSlice";

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
}

function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(LoginSchema),
    });
    const dispatch = useDispatch();
    const [login, { isLoading, error, isError }] = useLoginMutation();
    const navigate = useNavigate();
    const { email, password } = useSelector(
        (state: RootState) => state.auth.form
    );
    const theme = useTheme();

    const onSubmit = async (data: FormData) => {
        try {
            const response = await login(data).unwrap();
            dispatch(loginUser(response));
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
        }
    };

    function isFetchBaseQueryError(error: any): error is FetchBaseQueryError {
        return error && "data" in error;
    }

    useEffect(() => {
        dispatch(setLoading(isLoading));
    }, [isLoading]);

    return (
        <FlexCenter height={"100%"} border={1}>
            <Paper
                sx={{ padding: 5, width: 700, borderRadius: 4 }}
                elevation={2}
            >
                <Typography
                    align="center"
                    variant="h1"
                    fontWeight={700}
                    padding={5}
                >
                    Login
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box mb={3}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Email"
                            type="email"
                            defaultValue={email}
                            {...register("email")}
                            error={errors.email ? true : false}
                            helperText={
                                errors.email ? errors.email.message : null
                            }
                        />
                    </Box>

                    <Box mb={3}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Password"
                            type="password"
                            defaultValue={password}
                            {...register("password")}
                            error={errors.password ? true : false}
                            helperText={
                                errors.password ? errors.password.message : null
                            }
                        />
                    </Box>

                    <Box textAlign={"center"} mt={6}>
                        <Button variant="contained" size="large" type="submit">
                            Login
                        </Button>
                    </Box>
                </form>

                {isError && isFetchBaseQueryError(error) && (
                    <Box pt={4}>
                        <Alert severity="error">{error.data.message}</Alert>
                    </Box>
                )}

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
                    Didn't have already account yet?
                </Typography>
            </Paper>
        </FlexCenter>
    );
}

export default LoginPage;
