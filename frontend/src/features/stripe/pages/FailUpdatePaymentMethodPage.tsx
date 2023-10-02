import { useSelector } from "react-redux";
import { useCheckFailUpdatePaymentMutation } from "../paymentEndpoints";
import { useLocation, useNavigate } from "react-router-dom";
import useToggleDashboardLoading from "@/hooks/useToggleDashboardLoading";
import RouteList from "@/routes/RouteList";
import { useEffect } from "react";
import { selectCompany } from "@/features/auth/authSlice";
import FailResponseCard from "../components/FailResponseCard";

export default function FailUpdatePaymentMethodPage() {
    const companyId = useSelector(selectCompany);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");
    const navigate = useNavigate();
    const [checkFailUpdatePayment, { data, isLoading, isError }] =
        useCheckFailUpdatePaymentMutation();
    useToggleDashboardLoading(isLoading);

    useEffect(() => {
        if (sessionId) {
            checkFailUpdatePayment({ session_id: sessionId, companyId });
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
