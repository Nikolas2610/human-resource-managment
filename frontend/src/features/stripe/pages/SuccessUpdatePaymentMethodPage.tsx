import { selectCompany } from "@/features/auth/authSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useCheckSuccessUpdatePaymentMutation } from "../paymentEndpoints";
import SuccessResponseCard from "../components/SuccessResponseCard";
import RouteList from "@/routes/RouteList";

export default function SuccessUpdatePaymentMethodPage() {
    const companyId = useSelector(selectCompany);
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");
    const [checkSuccessUpdatePayment, { data, isLoading, isError }] =
        useCheckSuccessUpdatePaymentMutation();

    useEffect(() => {
        if (sessionId) {
            checkSuccessUpdatePayment({ session_id: sessionId, companyId });
        } else {
            navigate(RouteList.dashboard);
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
