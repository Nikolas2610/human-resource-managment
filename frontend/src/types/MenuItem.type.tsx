import { SvgIconComponent } from "@mui/icons-material";
import { SubscriptionAccessLevel } from "./subscriptions/SubscriptionAccessLevel.enum";

export interface MenuItem {
    link: string;
    title: string;
    icon: SvgIconComponent;
    subscriptionAccessLevel: SubscriptionAccessLevel[];
}