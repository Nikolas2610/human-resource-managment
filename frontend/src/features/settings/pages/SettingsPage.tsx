import usePageTitle from "@/hooks/usePageTitle";
import { Stack, Typography } from "@mui/material";
import RowSettingsWrapper from "../components/RowSettingsWrapper";
import RouteList from "@/routes/RouteList";
import HeaderPageAddFeature from "@/components/ui/HeaderPageAddFeature";

export default function SettingsPage() {
    usePageTitle("Settings");
    return (
        <>
            <HeaderPageAddFeature 
                headerTitle="Settings"
            />
            <Stack mt={4}>
                <RowSettingsWrapper to={RouteList.integrations}>
                    Integrations
                </RowSettingsWrapper>
                <RowSettingsWrapper
                    to={RouteList.editCompanyContactInformation}
                >
                    Contact Information
                </RowSettingsWrapper>
                <RowSettingsWrapper to={RouteList.companyCustomization}>
                    Customization
                </RowSettingsWrapper>
                <RowSettingsWrapper to={RouteList.subscription}>
                    Subscription
                </RowSettingsWrapper>
            </Stack>
        </>
    );
}
