import { useSelector } from "react-redux";
import { useGetLeaveTypeQuery } from "../leaveTypesEndpoints";
import { selectCompany } from "@/features/auth/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import RouteList from "@/routes/RouteList";
import LeaveTypeForm from "../forms/LeaveTypeForm";

export default function EditLeaveType() {
    const companyId = useSelector(selectCompany);
    const { leaveTypeId } = useParams();
    const navigate = useNavigate();
    const leaveTypeIdInt = leaveTypeId ? parseInt(leaveTypeId) : 0;

    const {
        data: leaveType = null,
        isLoading,
        isError,
    } = useGetLeaveTypeQuery({
        companyId,
        leaveTypeId: leaveTypeIdInt,
    });

    useEffect(() => {
        if (isError) {
            navigate(RouteList.leaveTypes);
        }
    }, [isError, navigate]);

    return (
        <>
            {isLoading
                ? "Loading leave type......."
                : leaveType && (
                      <LeaveTypeForm
                          formTitle="Edit Leave Type"
                          initialData={leaveType}
                          leaveTypeId={leaveTypeIdInt}
                      />
                  )}
        </>
    );
}
