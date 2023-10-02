import { Invoice } from "@/types/invoice/Invoice.type";
import { apiService } from "../api/apiService";

export const subscriptionEndpoints = apiService.injectEndpoints({
    endpoints: (builder) => ({
        renewPreviousSubscription: builder.mutation<
            { session_id: string; message: string },
            { company_id: number }
        >({
            query: (data) => ({
                url: "subscriptions/renew-previous-subscription",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "CompanySubscription" }],
        }),
        changeSubscription: builder.mutation<
            { session_id: string; message: string },
            { company_id: number; subscription_plan_id: number }
        >({
            query: ({ company_id, subscription_plan_id }) => ({
                url: `companies/${company_id}/subscriptions/change-subscription`,
                method: "POST",
                body: { subscription_plan_id },
            }),
            invalidatesTags: [{ type: "CompanySubscription" }],
        }),
        cancelSubscription: builder.mutation<
            { message: string },
            { company_id: number }
        >({
            query: ({ company_id }) => ({
                url: `companies/${company_id}/subscriptions/cancel-subscription`,
                method: "POST",
            }),
            invalidatesTags: [{ type: "CompanySubscription" }],
        }),
        updatePaymentSubscription: builder.mutation<
            { session_id: string; message: string },
            { company_id: number }
        >({
            query: ({ company_id }) => ({
                url: `companies/${company_id}/subscriptions/update-subscription-payment-method`,
                method: "POST",
            }),
            invalidatesTags: [{ type: "CompanySubscription" }],
        }),
        renewSubscription: builder.mutation<
            { message: string },
            { company_id: number }
        >({
            query: ({ company_id }) => ({
                url: `companies/${company_id}/subscriptions/renew-subscription`,
                method: "POST",
            }),
            invalidatesTags: [{ type: "CompanySubscription" }],
        }),
        getInvoices: builder.query<Invoice[], { company_id: number }>({
            query: ({ company_id }) => ({
                url: `companies/${company_id}/subscriptions/get-invoices`,
                method: "GET",
            }),
            providesTags: (result, _error, _arg) =>
                result ? ["Invoices"] : [],
        }),
    }),
});

export const {
    useGetInvoicesQuery,
    useRenewPreviousSubscriptionMutation,
    useChangeSubscriptionMutation,
    useCancelSubscriptionMutation,
    useUpdatePaymentSubscriptionMutation,
    useRenewSubscriptionMutation,
} = subscriptionEndpoints;
