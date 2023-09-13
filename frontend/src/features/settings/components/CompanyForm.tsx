import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import { useUpdateCompanyMutation } from "@/features/companies/companiesEndpoints";
import { useHandleMutation } from "@/hooks/useHandleMutation";
import { CompanyContactInformationForm } from "@/types/companies/CompanyContactInformationForm.type";
import { generateRequiredErrorMessage } from "@/utils/functions";
import { isValidURL } from "@/utils/helpers/functions";
import { Button, Grid, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

export default function CompanyForm({ company }: CompanyFormProps) {
    const formData: CompanyContactInformationForm = { ...company };
    console.log(formData);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<CompanyContactInformationForm>({
        defaultValues: company,
    });
    const [updateCompany, { isLoading, isSuccess, isError, error }] =
        useUpdateCompanyMutation();

    useHandleMutation({
        isLoading,
        isSuccess,
        isError,
        error,
        actionType: "update",
        entityType: "Company",
        redirectTo: "",
    });

    const onSubmit = (data: CompanyContactInformationForm) => {
        console.log(data);
        updateCompany(data);
    };

    return (
        <Stack
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
            mt={4}
            spacing={2}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Company Name"
                        placeholder="Company Name"
                        {...register("name", {
                            required:
                                generateRequiredErrorMessage("Company name"),
                        })}
                        error={Boolean(errors.name)}
                        helperText={errors.name?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Company phone"
                        placeholder="Company phone"
                        {...register("phone_number")}
                        error={Boolean(errors.phone_number)}
                        helperText={errors.phone_number?.message}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Email company"
                        placeholder="Email company"
                        {...register("email_company", {
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Invalid email address",
                            },
                        })}
                        error={Boolean(errors.email_company)}
                        helperText={errors.email_company?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Contact email"
                        placeholder="Contact email"
                        {...register("contact_email", {
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Invalid email address",
                            },
                        })}
                        error={Boolean(errors.contact_email)}
                        helperText={errors.contact_email?.message}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="HR mail"
                        placeholder="HR mail"
                        {...register("hr_mail", {
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Invalid email address",
                            },
                        })}
                        error={Boolean(errors.hr_mail)}
                        helperText={errors.hr_mail?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Address"
                        placeholder="Address"
                        {...register("address")}
                        error={Boolean(errors.address)}
                        helperText={errors.address?.message}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Website"
                        placeholder="Website"
                        {...register("website", {
                            validate: (value: string | null) =>
                                value
                                    ? isValidURL(value) || "Not a valid URL"
                                    : true,
                        })}
                        error={Boolean(errors.website)}
                        helperText={errors.website?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Facebook"
                        placeholder="Facebook"
                        {...register("facebook", {
                            validate: (value: string | null) =>
                                value
                                    ? isValidURL(value) || "Not a valid URL"
                                    : true,
                        })}
                        error={Boolean(errors.facebook)}
                        helperText={errors.facebook?.message}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Instagram"
                        placeholder="Instagram"
                        {...register("instagram", {
                            validate: (value: string | null) =>
                                value
                                    ? isValidURL(value) || "Not a valid URL"
                                    : true,
                        })}
                        error={Boolean(errors.instagram)}
                        helperText={errors.instagram?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Twitter"
                        placeholder="Twitter"
                        {...register("twitter", {
                            validate: (value: string | null) =>
                                value
                                    ? isValidURL(value) || "Not a valid URL"
                                    : true,
                        })}
                        error={Boolean(errors.twitter)}
                        helperText={errors.twitter?.message}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Linkedin"
                        placeholder="Linkedin"
                        {...register("linkedin", {
                            validate: (value: string | null) =>
                                value
                                    ? isValidURL(value) || "Not a valid URL"
                                    : true,
                        })}
                        error={Boolean(errors.linkedin)}
                        helperText={errors.linkedin?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="YouTube"
                        placeholder="YouTube"
                        {...register("youtube", {
                            validate: (value: string | null) =>
                                value
                                    ? isValidURL(value) || "Not a valid URL"
                                    : true,
                        })}
                        error={Boolean(errors.youtube)}
                        helperText={errors.youtube?.message}
                    />
                </Grid>
            </Grid>

            {/* Make a submit button as disabled and when change something to the data make it enable */}
            <FlexCenter pt={4}>
                <Button
                    variant="contained"
                    type="submit"
                    disabled={isLoading || !isDirty}
                >
                    Submit
                </Button>
            </FlexCenter>
        </Stack>
    );
}

interface CompanyFormProps {
    company: CompanyContactInformationForm;
}
