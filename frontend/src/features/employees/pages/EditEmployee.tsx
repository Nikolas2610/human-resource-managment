import { useNavigate, useParams } from "react-router-dom";
import { useGetEmployeeQuery } from "../employeesEndpoints";
import { useSelector } from "react-redux";
import { selectCompany } from "@/features/auth/authSlice";
import RouteList from "@/routes/RouteList";
import { useEffect, useState } from "react";
import { NewEmployee } from "@/types/employee/NewEmployee.type";
import EmployeeForm from "../form/EmployeeForm";
import dayjs from "dayjs";

export default function EditEmployee() {
    const { employeeId } = useParams();
    const companyId = useSelector(selectCompany);
    const navigate = useNavigate();
    const [editEmployee, setEditEmployee] = useState<NewEmployee | null>(null);
    const employeeIdInt = employeeId ? parseInt(employeeId) : 0;
    const { data: employee, isError } = useGetEmployeeQuery({
        companyId,
        employeeId: employeeIdInt,
    });

    useEffect(() => {
        if (isError) {
            navigate(RouteList.employees);
        }
    }, [isError, navigate]);

    useEffect(() => {
        if (employee) {
            setEditEmployee({
                first_name: employee.first_name,
                last_name: employee.last_name,
                active: employee.active,
                email: employee.email,
                address: employee.address,
                department_id: employee.department?.id as number,
                phone: employee.phone,
                position_id: employee.position?.id as number,
                reports_to: employee.reports_to?.id,
                role: employee.role,
                salary: employee.salary,
                work_start_date: dayjs(employee.work_start_date),
                password: "",
                password_confirmation: "",
                companyId: companyId,
                leave_types: employee.leave_types,
                image: employee.image ?? null,
                personal_email: employee.personal_email,
                name_day: dayjs(employee.name_day),
                birthday: dayjs(employee.birthday),
                married: employee.married ?? false,
                childs_count: employee.childs_count,
                type_of_job: employee.type_of_job,
                // documents: employee.documents ?? [],
            });
        }
    }, [employee]);

    return (
        <>
            {editEmployee && (
                <EmployeeForm
                    formTitle="Edit Employee"
                    initialData={editEmployee}
                    employeeId={employee?.id}
                />
            )}
        </>
    );
}
