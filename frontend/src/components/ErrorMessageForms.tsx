import { Box, Typography } from "@mui/material";
import React from "react";
import { ValidationErrorForm } from "../types/ValidationErrorForm.type";

export default function ErrorMessageForms({
    children,
    errors,
    fieldName,
}: IErrorMessageFormsProps) {
    let errorMessage = null;

    if (errors) {
        errorMessage = errors.hasOwnProperty(fieldName)
            ? errors[fieldName][0]
            : null;
    }

    return (
        <Box>
            {children}
            {errorMessage && (
                <Typography color={"error"} px={2} py={1}>
                    {errorMessage}
                </Typography>
            )}
        </Box>
    );
}

interface IErrorMessageFormsProps {
    children: React.ReactNode;
    errors: ValidationErrorForm | null;
    fieldName: string;
}
