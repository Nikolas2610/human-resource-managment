import usePageTitle from "@/hooks/usePageTitle";
import { Stack } from "@mui/material";
import RowSettingsWrapper from "../components/RowSettingsWrapper";
import RouteList from "@/routes/RouteList";
import HeaderPageAddFeature from "@/components/ui/HeaderPageAddFeature";
import { SubscriptionAccessLevel } from "@/types/subscriptions/SubscriptionAccessLevel.enum";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

export default function SettingsPage() {
    const { subscriptionAccessLevel } = useSelector(
        (state: RootState) => state.auth
    );
    console.log(
        "🚀 ~ file: SettingsPage.tsx:12 ~ SettingsPage ~ subscriptionAccessLevel:",
        subscriptionAccessLevel
    );
    usePageTitle("Settings");
    const settingsItems = [
        {
            title: "Integrations",
            link: RouteList.integrations,
            subscriptionAccessLevel: [
                SubscriptionAccessLevel.LEVEL_TWO,
                SubscriptionAccessLevel.LEVEL_THREE,
            ],
        },
        {
            title: "Contact Information",
            link: RouteList.editCompanyContactInformation,
            subscriptionAccessLevel: [
                SubscriptionAccessLevel.LEVEL_ONE,
                SubscriptionAccessLevel.LEVEL_TWO,
                SubscriptionAccessLevel.LEVEL_THREE,
            ],
        },
        {
            title: "Customization",
            link: RouteList.companyCustomization,
            subscriptionAccessLevel: [
                SubscriptionAccessLevel.LEVEL_ONE,
                SubscriptionAccessLevel.LEVEL_TWO,
                SubscriptionAccessLevel.LEVEL_THREE,
            ],
        },
        {
            title: "Subscription",
            link: RouteList.subscription,
            subscriptionAccessLevel: [
                SubscriptionAccessLevel.EXPIRED,
                SubscriptionAccessLevel.LEVEL_ONE,
                SubscriptionAccessLevel.LEVEL_TWO,
                SubscriptionAccessLevel.LEVEL_THREE,
            ],
        },
    ];

    return (
        <>
            <HeaderPageAddFeature headerTitle="Settings" />
            <Stack mt={4}>
                {settingsItems.map((item) => {
                    if (
                        item.subscriptionAccessLevel.includes(
                            subscriptionAccessLevel
                        )
                    ) {
                        return (
                            <RowSettingsWrapper to={item.link}>
                                {item.title}
                            </RowSettingsWrapper>
                        );
                    }
                })}
            </Stack>
        </>
    );
}
