import { useLocation, useNavigate } from "react-router-dom";
import { useCheckFailPaymentMutation } from "../paymentEndpoints";
import { useEffect } from "react";
import RouteList from "@/routes/RouteList";
import { useSelector } from "react-redux";
import { selectCompany } from "@/features/auth/authSlice";
import useToggleDashboardLoading from "@/hooks/useToggleDashboardLoading";
import FailResponseCard from "../components/FailResponseCard";

export default function FailPaymentPage() {
    const companyId = useSelector(selectCompany);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");
    const navigate = useNavigate();
    const [checkFailPayment, { data, isLoading, isError }] =
        useCheckFailPaymentMutation();
    useToggleDashboardLoading(isLoading);

    useEffect(() => {
        if (sessionId) {
            checkFailPayment({ session_id: sessionId, companyId });
        }
    }, [0]);

    if (isError) {
        navigate(RouteList.dashboard);
        return "Error";
    }

    if (isLoading) {
        return "Loading...";
    }

    return data && data.success ? <FailResponseCard data={data} /> : null;
}
