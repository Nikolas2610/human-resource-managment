import { Button, Stack, TextField } from "@mui/material";
import RouteList from "@/routes/RouteList";
import FlexCenter from "../../../components/ui/wrappers/FlexCenter";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
    useCreateDepartmentMutation,
    useEditDepartmentMutation,
} from "../departmentEndpoints";
import HeaderPageBackFeature from "@/components/ui/HeaderPageBackFeature";
import SelectField from "@/components/ui/form/SelectField";
import { useGetEmployeesQuery } from "@/features/employees/employeesEndpoints";
import { selectCompany } from "@/features/auth/authSlice";
import useToggleDashboardLoading from "@/hooks/useToggleDashboardLoading";
import useSuccessSnackbar from "@/hooks/useSuccessSnackbar";
import generateResponseMessage from "@/utils/helpers/generateResponseMessage";
import { NewDepartment } from "@/types/departments/NewDepartment.type";

export default function DepartmentForm({
    formTitle,
    initialData,
}: DepartmentFormProps) {
    const companyId = useSelector(selectCompany);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: initialData,
    });
    const { data: employees = [], isLoading: isEmployeesLoading } =
        useGetEmployeesQuery(companyId);

    const [createDepartment, { isLoading: isCreateLoading, isSuccess }] =
        useCreateDepartmentMutation();
    const [
        editDepartment,
        { isLoading: isEditLoading, isSuccess: isEditSuccess },
    ] = useEditDepartmentMutation();

    // Custom Hooks
    useToggleDashboardLoading(isCreateLoading);
    useToggleDashboardLoading(isEditLoading);
    useSuccessSnackbar({
        isSuccess,
        message: generateResponseMessage("Department", "store"),
        to: RouteList.departments,
    });
    useSuccessSnackbar({
        isSuccess: isEditSuccess,
        message: generateResponseMessage("Department", "update"),
        to: RouteList.departments,
    });

    const onSubmit = (data: NewDepartment) => {
        if (initialData) {
            editDepartment({
                companyId,
                department: { id: initialData.id, ...data },
            });
        } else {
            createDepartment({ companyId, department: data });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {isEmployeesLoading ? (
                "Loading form..."
            ) : (
                <Stack spacing={4}>
                    <HeaderPageBackFeature
                        headerTitle={formTitle}
                        to={RouteList.departments}
                        buttonTitle="Back to Departments"
                    />

                    <TextField
                        variant="outlined"
                        label="Name"
                        placeholder="Write the name of the department"
                        {...register("name", {
                            required: "Name is required",
                            minLength: {
                                value: 4,
                                message: "Minimum length is 4",
                            },
                        })}
                        disabled={isEditLoading || isCreateLoading}
                        error={Boolean(errors.name)}
                        helperText={errors.name?.message}
                    />

                    <SelectField
                        name="manager_id"
                        control={control}
                        defaultValue={initialData?.manager_id ?? ""}
                        rules={{}}
                        options={[
                            { id: "", title: "None" },
                            ...employees.map((employee) => ({
                                id: employee.id,
                                title: `${employee.first_name} ${employee.last_name}`,
                            })),
                        ]}
                        getOptionLabel={(option) => option.title}
                        getOptionValue={(option) => option.id}
                        errorObject={errors}
                        isDisabled={isEditLoading || isCreateLoading}
                        label="Manager"
                    />

                    <FlexCenter>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={isEditLoading || isCreateLoading}
                        >
                            Submit
                        </Button>
                    </FlexCenter>
                </Stack>
            )}
        </form>
    );
}

interface DepartmentFormProps {
    formTitle: string;
    initialData?: NewDepartment;
}
