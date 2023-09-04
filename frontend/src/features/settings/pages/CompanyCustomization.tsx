import { Box, Button, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import HeaderPageBackFeature from "@/components/ui/HeaderPageBackFeature";
import RouteList from "@/routes/RouteList";
import ImageUploadField from "@/components/ui/form/ImageUploadField";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import {
    useGetCompanyQuery,
    useUpdateCompanyCustomizationMutation,
} from "@/features/companies/companiesEndpoints";
import { useSelector } from "react-redux";
import { selectCompany } from "@/features/auth/authSlice";
import { useHandleMutation } from "@/hooks/useHandleMutation";
import { useState } from "react";

interface IFormInput {
    logo: string;
    primary_color: string;
    secondary_color: string;
}

export default function CompanyCustomization() {
    const {
        handleSubmit,
        control,
        setValue,
        register,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<IFormInput>();
    const theme = useTheme();
    const companyId = useSelector(selectCompany);
    const [file, setFile] = useState<File | null>(null);
    const { data: company = null, isLoading: isDataLoading } = useGetCompanyQuery(companyId);
    const [
        updateCompanyCustomization,
        { isLoading, isSuccess, isError, error },
    ] = useUpdateCompanyCustomizationMutation();

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        const { primary_color, secondary_color } = data;

        // Create a new FormData object and append the logo file
        const formData = new FormData();
        if (file) {
            formData.append("logo", file);
            formData.append("primary_color", primary_color);
            formData.append("secondary_color", secondary_color);
        }

        updateCompanyCustomization({
            companyId,
            formData,
        });
    };

    useHandleMutation({
        isError,
        isSuccess,
        isLoading,
        error,
        entityType: "Company Customization",
        actionType: "update",
        redirectTo: "",
    });

    if (isDataLoading) {
        return "Loading..."
    }

    return (
        <>
            <HeaderPageBackFeature
                headerTitle="Customization"
                to={RouteList.settings}
                buttonTitle="Back to Settings"
            />
            <Stack
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                gap={3}
                mt={4}
            >
                <ImageUploadField
                    control={control}
                    setValue={setValue}
                    errors={errors}
                    name={"logo"}
                    label="Upload Image"
                    defaultValue={company?.logo ?? null}
                    setError={setError}
                    clearErrors={clearErrors}
                    setFile={(file) => setFile(file)}
                />

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Box
                            display={"flex"}
                            gap={4}
                            p={2}
                            boxShadow={8}
                            borderRadius={4}
                            alignItems={"center"}
                            bgcolor={theme.palette.background.paper}
                        >
                            <Typography variant="h4">
                                Primary Color:{" "}
                            </Typography>
                            <input
                                {...register("primary_color", {
                                    required: "The primary color is required",
                                })}
                                type="color"
                                style={{
                                    width: "150px",
                                    height: "40px",
                                    border: "none",
                                }}
                                defaultValue={
                                    company?.primary_color ??
                                    theme.palette.primary.main
                                }
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            display={"flex"}
                            gap={4}
                            p={2}
                            boxShadow={8}
                            borderRadius={4}
                            alignItems={"center"}
                            bgcolor={theme.palette.background.paper}
                        >
                            <Typography variant="h4">
                                Secondary Color:{" "}
                            </Typography>
                            <input
                                {...register("secondary_color", {
                                    required: "The secondary color is required",
                                })}
                                style={{
                                    width: "150px",
                                    height: "40px",
                                    border: "none",
                                }}
                                type="color"
                                defaultValue={
                                    company?.secondary_color ??
                                    theme.palette.secondary.main
                                }
                            />
                        </Box>
                    </Grid>
                </Grid>

                <FlexCenter mt={4}>
                    <Button type="submit" variant="contained" color="primary">
                        Save
                    </Button>
                </FlexCenter>
            </Stack>
        </>
    );
}
