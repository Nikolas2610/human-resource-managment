import HeaderPageBackFeature from "@/components/ui/HeaderPageBackFeature";
import { selectCompany } from "@/features/auth/authSlice";
import RouteList from "@/routes/RouteList";
import { useSelector } from "react-redux";
import { useGetInvoicesQuery } from "../subscriptionEndpoints";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Link,
    IconButton,
    Chip,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { convertToDDMMYYYY } from "@/utils/helpers/functions";
import { useDispatch } from "react-redux";
import { apiService } from "@/features/api/apiService";
import useToggleDashboardLoading from "@/hooks/useToggleDashboardLoading";
import usePageTitle from "@/hooks/usePageTitle";

export default function InvoicesPage() {
    const dispatch = useDispatch();
    const companyId = useSelector(selectCompany);
    const {
        data: invoices = [],
        isLoading,
        isError,
    } = useGetInvoicesQuery({ company_id: companyId });
    useToggleDashboardLoading(isLoading);
    usePageTitle("Invoices");

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return "Error";
    }

    const handleLinkClick = (_event: any) => {
        // Clean cache data for CompanySubscription
        dispatch(
            apiService.util.invalidateTags([
                { type: "CompanySubscription" },
                { type: "Invoices" },
            ])
        );
    };

    return (
        <>
            <HeaderPageBackFeature
                headerTitle="Invoices"
                buttonTitle="Back to Subscription"
                to={RouteList.subscription}
            />
            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Invoice Number</TableCell>
                            <TableCell align="right">Amount Due</TableCell>
                            <TableCell align="right">Currency</TableCell>
                            <TableCell align="right">Due Date</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Payment Link</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.invoice_number}>
                                <TableCell component="th" scope="row">
                                    {invoice.invoice_number}
                                </TableCell>
                                <TableCell align="right">
                                    {invoice.amount_due.toFixed(2)}
                                </TableCell>
                                <TableCell align="right">
                                    {invoice.currency.toUpperCase()}
                                </TableCell>
                                <TableCell align="right">
                                    {convertToDDMMYYYY(invoice.due_date)}
                                </TableCell>
                                <TableCell align="center">
                                    {invoice.status === "paid" ? (
                                        <Chip label="Paid" color="success" />
                                    ) : (
                                        <Chip label="Unpaid" color="error" />
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {invoice.payment_link ? (
                                        <Link
                                            href={invoice.payment_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={handleLinkClick}
                                        >
                                            <IconButton>
                                                <OpenInNewIcon />
                                            </IconButton>
                                        </Link>
                                    ) : (
                                        "No payment link"
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
