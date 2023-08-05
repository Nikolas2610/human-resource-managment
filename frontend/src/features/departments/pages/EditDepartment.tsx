import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setPageTitle,
    toggleDashboardLoading,
} from "../../dashboard/dashboardSlice";
import { useNavigate, useParams } from "react-router-dom";
import { selectCompany } from "../../auth/authSlice";
import RouteList from "@/routes/RouteList";
import DepartmentForm from "../forms/DepartmentForm";
import { Department } from "../../../types/departments/Department.type";
import { useGetDepartmentQuery } from "../departmentEndpoints";

export default function EditDepartment() {
    const dispatch = useDispatch();
    const { departmentId: departmentIdString } = useParams();
    const companyId = useSelector(selectCompany);
    const navigate = useNavigate();
    const departmentId = departmentIdString ? parseInt(departmentIdString) : 0;

    const { data, isError, isLoading } = useGetDepartmentQuery({
        companyId,
        departmentId,
    }) as {
        data: Department;
        error: unknown;
        isError: boolean;
        isLoading: boolean;
    };

    useEffect(() => {
        dispatch(setPageTitle("Edit Department"));
    }, [dispatch]);

    useEffect(() => {
        dispatch(toggleDashboardLoading(isLoading));
    }, [isLoading]);

    useEffect(() => {
        if (isError) {
            navigate(RouteList.departments);
        }
    }, [isError]);

    return (
        <>
            {data && (
                <DepartmentForm
                    formTitle="Edit Department"
                    initialData={data}
                />
            )}
        </>
    );
}
