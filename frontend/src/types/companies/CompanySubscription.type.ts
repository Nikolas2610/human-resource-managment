import { SubscriptionStatus } from "@/features/settings/enum/SubscriptionStatus";
import { SubscriptionPlan } from "../subscriptions/SubscriptionPlan.type";

export interface CompanySubscription {
    start_date: string;
    expiry_date: string;
    status: SubscriptionStatus;
    employees_count: number;
    subscription_plan: SubscriptionPlan;
}
