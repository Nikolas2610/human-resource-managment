export interface SubscriptionPlan {
    id: number;
    name: string;
    price: number;
    duration: string;
    min_users: number;
    max_users: number;
}