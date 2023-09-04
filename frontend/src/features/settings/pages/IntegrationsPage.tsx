import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Stack, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import { selectCompany } from "@/features/auth/authSlice";
import { useGetCompanyQuery } from "@/features/companies/companiesEndpoints";
import RowIntegrationWrapper from "../components/RowIntegrationWrapper";
import HeaderPageBackFeature from "@/components/ui/HeaderPageBackFeature";
import RouteList from "@/routes/RouteList";
import usePageTitle from "@/hooks/usePageTitle";

interface IntegrationSettings {
    require_hr_approval: boolean;
    require_manager_approval: boolean;
    celebrate_birthdays: boolean;
    celebrate_name_days: boolean;
    celebrate_anniversaries: boolean;
}

const integrationMap = {
    require_hr_approval: "HR Approved",
    require_manager_approval: "Manager Approved",
    celebrate_birthdays: "Celebrate Birthdays",
    celebrate_name_days: "Celebrate Name Days",
    celebrate_anniversaries: "Celebrate Anniversaries",
};

export default function IntegrationsPage() {
    const companyId = useSelector(selectCompany);
    const { data: company, isLoading } = useGetCompanyQuery(companyId);
    const { handleSubmit, control, reset, formState } =
        useForm<IntegrationSettings>();
    const { isDirty } = formState;
    usePageTitle("Integrations");

    useEffect(() => {
        if (company) {
            reset({
                require_hr_approval: company.require_hr_approval || false,
                require_manager_approval:
                    company.require_manager_approval || false,
                celebrate_birthdays: company.celebrate_birthdays || false,
                celebrate_name_days: company.celebrate_name_days || false,
                celebrate_anniversaries:
                    company.celebrate_anniversaries || false,
            });
        }
    }, [company, reset]);

    const onSubmit = (data: IntegrationSettings) => {
        // Send updated data to the backend
        console.log(data);
        // Reset the form state after saving
        reset(data);
    };

    const onCancel = () => {
        if (company) {
            // Reset the form fields to the initial state
            reset({
                require_hr_approval: company.require_hr_approval,
                require_manager_approval: company.require_manager_approval,
                celebrate_birthdays: company.celebrate_birthdays,
                celebrate_name_days: company.celebrate_name_days,
                celebrate_anniversaries: company.celebrate_anniversaries,
            });
        }
    };

    if (isLoading || !company) {
        return "Loading...";
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderPageBackFeature 
                headerTitle="Integrations"  
                to={RouteList.settings}
                buttonTitle="Back to Settings"              
            />
            <Stack mt={4}>
                {(
                    Object.keys(integrationMap) as Array<
                        keyof IntegrationSettings
                    >
                ).map((key) => (
                    <Controller
                        key={key}
                        name={key}
                        control={control}
                        render={({ field }) => (
                            <RowIntegrationWrapper
                                value={field.value}
                                setValue={field.onChange}
                            >
                                {integrationMap[key]}
                            </RowIntegrationWrapper>
                        )}
                    />
                ))}
            </Stack>

            <FlexCenter gap={2} my={4}>
                <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={onCancel}
                    disabled={!isDirty}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isDirty}
                >
                    Save
                </Button>
            </FlexCenter>
        </form>
    );
}
