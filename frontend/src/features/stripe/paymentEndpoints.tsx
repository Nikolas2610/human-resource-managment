import { SuccessPaymentResponse } from "@/types/payments/SuccessPaymentResponse.type";
import { apiService } from "../api/apiService";
import { FailPaymentResponse } from "@/types/payments/FailPaymentResponse.type";
import { PaymentRequest } from "@/types/payments/PaymentRequest.type";

export const paymentEndpoints = apiService.injectEndpoints({
    endpoints: (builder) => ({
        checkSuccessPayment: builder.mutation<
            SuccessPaymentResponse,
            PaymentRequest
        >({
            query: ({ companyId, session_id }) => ({
                url: `companies/${companyId}/payment-token/success-payment`,
                method: "POST",
                body: { session_id },
            }),
        }),
        checkFailPayment: builder.mutation<FailPaymentResponse, PaymentRequest>(
            {
                query: ({ companyId, session_id }) => ({
                    url: `companies/${companyId}/payment-token/fail-payment`,
                    method: "POST",
                    body: { session_id },
                }),
            }
        ),
        checkSuccessUpdatePayment: builder.mutation<
            SuccessPaymentResponse,
            PaymentRequest
        >({
            query: ({ companyId, session_id }) => ({
                url: `companies/${companyId}/payment-token/success-update`,
                method: "POST",
                body: { session_id },
            }),
        }),
        checkFailUpdatePayment: builder.mutation<
            FailPaymentResponse,
            PaymentRequest
        >({
            query: ({ companyId, session_id }) => ({
                url: `companies/${companyId}/payment-token/fail-update`,
                method: "POST",
                body: { session_id },
            }),
        }),
    }),
});

export const {
    useCheckSuccessPaymentMutation,
    useCheckFailPaymentMutation,
    useCheckFailUpdatePaymentMutation,
    useCheckSuccessUpdatePaymentMutation,
} = paymentEndpoints;
