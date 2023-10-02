import RouteList from "@/routes/RouteList";
import { useLocation, useNavigate } from "react-router-dom";
import { useCheckSuccessPaymentMutation } from "../paymentEndpoints";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCompany } from "@/features/auth/authSlice";
import SuccessResponseCard from "../components/SuccessResponseCard";

export default function SuccessPaymentPage() {
    const companyId = useSelector(selectCompany);
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");
    const [checkSuccessPayment, { data, isLoading, isError }] =
        useCheckSuccessPaymentMutation();

    useEffect(() => {
        if (sessionId) {
            checkSuccessPayment({ session_id: sessionId, companyId });
        }
    }, []);

    if (isError || (data && !data.success)) {
        navigate(RouteList.dashboard);
        return null; // No rendering after redirect
    }

    if (isLoading) {
        return "Loading...";
    }

    return data && data.success ? <SuccessResponseCard data={data} /> : null;
}
