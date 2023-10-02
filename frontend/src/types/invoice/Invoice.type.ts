export  interface Invoice {
    amount_due: number;
    currency: string;
    due_date: string;
    invoice_number: string;
    status: string;
    payment_link?: string;
}