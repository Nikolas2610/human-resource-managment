import { SubscriptionPlanDuration } from "@/types/subscriptions/SubscriptionPlanDuration.enum";
import { SubscriptionPlanName } from "@/types/subscriptions/SubscriptionPlanName.enum";

export const subscriptionPlans = [
    {
        title: SubscriptionPlanName.BASIC,
        price: { monthly: 29.99, yearly: 299.99 },
        users: "0-25 users",
    },
    {
        title: SubscriptionPlanName.PRO,
        price: { monthly: 59.99, yearly: 599.99 },
        users: "26-50 users",
    },
    {
        title: SubscriptionPlanName.ENTERPRISE,
        price: { monthly: 99.99, yearly: 999.99 },
        users: "50+ users",
    },
];

const subscriptionPlansIds: SubscriptionPlansIds = {
    basic: { monthly: 2, yearly: 5 },
    pro: { monthly: 3, yearly: 6 },
    enterprise: { monthly: 4, yearly: 7 },
};

export const getSubscriptionPlanId = (
    plan: SubscriptionPlanName,
    duration: SubscriptionPlanDuration
) => {
    return subscriptionPlansIds[plan][duration];
};

interface SubscriptionPlansIds {
    basic: { monthly: number; yearly: number };
    pro: { monthly: number; yearly: number };
    enterprise: { monthly: number; yearly: number };
}
