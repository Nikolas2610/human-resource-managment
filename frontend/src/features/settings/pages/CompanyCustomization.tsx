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
import { useEffect, useState } from "react";
import { useThemeContext } from "@/contexts/DynamicThemeProvider";
import { DARK_COLORS } from "@/themes/Colors";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";

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
    const { data: company = null, isLoading: isDataLoading } =
        useGetCompanyQuery(companyId);
    const [
        updateCompanyCustomization,
        { isLoading, isSuccess, isError, error },
    ] = useUpdateCompanyCustomizationMutation();
    const { setPrimaryColor } = useThemeContext();

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        const { primary_color, secondary_color } = data;

        // Create a new FormData object and append the logo file
        const formData = new FormData();
        if (file) {
            formData.append("logo", file);
        }
        formData.append("primary_color", primary_color);
        formData.append("secondary_color", secondary_color);

        updateCompanyCustomization({
            companyId,
            formData,
        });
    };

    useEffect(() => {
        if (company && company.logo) {
            setValue("logo", company.logo);
        }
    }, [company]);

    useHandleMutation({
        isError,
        isSuccess,
        isLoading,
        error,
        entityType: "Company Customization",
        actionType: "update",
        redirectTo: "",
    });

    const handleUpdatePrimaryColor = (color: string) => {
        setPrimaryColor(color);
    };

    const setDefaultPrimaryColor = () => {
        setPrimaryColor(DARK_COLORS.PRIMARY);
        setValue("primary_color", DARK_COLORS.PRIMARY);
    };
    const setDefaultSecondaryColor = () => {
        setPrimaryColor(DARK_COLORS.SECONDARY);
        setValue("secondary_color", DARK_COLORS.SECONDARY);
    };

    if (isDataLoading) {
        return "Loading...";
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
                    title="Logo"
                    box
                />

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <FlexBetween
                            p={2}
                            boxShadow={8}
                            borderRadius={4}
                            bgcolor={theme.palette.background.paper}
                            sx={{
                                display: {
                                    xs: "block",
                                    lg: "flex",
                                },
                            }}
                        >
                            <Box display={"flex"} gap={4} alignItems={"center"}>
                                <Typography variant="h4">
                                    Primary Color:{" "}
                                </Typography>
                                <input
                                    {...register("primary_color", {
                                        required:
                                            "The primary color is required",
                                    })}
                                    type="color"
                                    style={{
                                        width: "150px",
                                        height: "40px",
                                        border: "none",
                                    }}
                                    onChange={(event) =>
                                        handleUpdatePrimaryColor(
                                            event.target.value
                                        )
                                    }
                                    defaultValue={
                                        company?.primary_color ??
                                        theme.palette.primary.main
                                    }
                                />
                            </Box>
                            <Button onClick={setDefaultPrimaryColor}>
                                Set Default Color
                            </Button>
                        </FlexBetween>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FlexBetween
                            p={2}
                            boxShadow={8}
                            borderRadius={4}
                            bgcolor={theme.palette.background.paper}
                            sx={{
                                display: {
                                    xs: "block",
                                    lg: "flex",
                                },
                            }}
                        >
                            <Box display={"flex"} gap={4} alignItems={"center"}>
                                <Typography variant="h4">
                                    Secondary Color:{" "}
                                </Typography>
                                <input
                                    {...register("secondary_color", {
                                        required:
                                            "The secondary color is required",
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
                            <Button onClick={setDefaultSecondaryColor}>
                                Set Default Color
                            </Button>
                        </FlexBetween>
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
