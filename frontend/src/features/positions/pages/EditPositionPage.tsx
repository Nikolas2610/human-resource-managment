import {
    setPageTitle,
    toggleDashboardLoading,
} from "@/features/dashboard/dashboardSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPositionQuery } from "../positionsEndpoints";
import { selectCompany } from "@/features/auth/authSlice";
import { Position } from "@/types/positions/Position.type";
import RouteList from "@/routes/RouteList";
import PositionForm from "../forms/PositionForm";

export default function EditPositionPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const companyId = useSelector(selectCompany);
    const { positionId: positionStringId } = useParams();
    const positionId = positionStringId ? parseInt(positionStringId) : 0;

    const { data, isError, isLoading } = useGetPositionQuery({
        companyId,
        positionId,
    }) as {
        data: Position;
        error: unknown;
        isError: boolean;
        isLoading: boolean;
    };

    useEffect(() => {
        dispatch(setPageTitle("Edit Position"));
    }, [dispatch]);

    useEffect(() => {
        dispatch(toggleDashboardLoading(isLoading));
    }, [isLoading]);

    useEffect(() => {
        if (isError) {
            navigate(RouteList.positions);
        }
    }, [isError]);

    return (
        <>
            {data && (
                <PositionForm formTitle="Edit Position" initialData={data} />
            )}
        </>
    );
}
