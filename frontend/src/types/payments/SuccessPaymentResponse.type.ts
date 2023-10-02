import { Invoice } from "../invoice/Invoice.type";

export interface SuccessPaymentResponse {
    message: string;
    success: boolean;
    invoice?: Invoice;
}
