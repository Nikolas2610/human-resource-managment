import { useDispatch } from "react-redux";
import DepartmentForm from "../forms/DepartmentForm";
import { setPageTitle } from "../../dashboard/dashboardSlice";
import { useEffect } from "react";

export default function CreateDepartment() {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(setPageTitle("Create Department"));
    }, []);

  return (
    <DepartmentForm formTitle="Create Department" />
  )
}
