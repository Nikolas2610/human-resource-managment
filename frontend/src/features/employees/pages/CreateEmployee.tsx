import { setPageTitle } from "@/features/dashboard/dashboardSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import EmployeeForm from "../form/EmployeeForm";

export default function CreateEmployee() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle("Add Employee"));
    }, []);

    return (
        <>
            <EmployeeForm formTitle="Add Employee" />
        </>
    );
}
