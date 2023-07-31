import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
        .min(6, "Password is too short - should be 6 chars minimum.")
        .required("No password provided."),
});
