import { Button, Stack, TextField } from "@mui/material";
import RouteList from "@/routes/RouteList";
import FlexCenter from "../../../components/ui/wrappers/FlexCenter";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useEffect } from "react";
import { toggleDashboardLoading } from "@/features/dashboard/dashboardSlice";
import { useNavigate } from "react-router-dom";
import {
    useCreateDepartmentMutation,
    useEditDepartmentMutation,
} from "../departmentEndpoints";
import HeaderPageBackFeature from "@/components/ui/HeaderPageBackFeature";
import { setSnackbar } from "@/features/snackbars/snackbarSlice";

export default function DepartmentForm({
    formTitle,
    initialData,
}: DepartmentFormProps) {
    const companyId =
        useSelector((state: RootState) => state.auth.user?.company_id) || 0;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: initialData,
    });
    const [createDepartment, { isLoading: isCreateLoading, isSuccess }] =
        useCreateDepartmentMutation();
    const [
        editDepartment,
        { isLoading: isEditLoading, isSuccess: isEditSuccess },
    ] = useEditDepartmentMutation();

    const onSubmit = (data: NewDepartment) => {
        if (initialData) {
            editDepartment({
                companyId,
                department: { id: (initialData.id), ...data },
            });
        } else {
            createDepartment({ companyId, department: data });
        }
    };

    useEffect(() => {
        dispatch(toggleDashboardLoading(isCreateLoading));
    }, [isCreateLoading]);

    useEffect(() => {
        if (isSuccess) {
            dispatch(setSnackbar({
                message: "Department created successfully"
            }))
            navigate(RouteList.departments);
        }
    }, [isSuccess]);

    useEffect(() => {
        dispatch(toggleDashboardLoading(isEditLoading));
    }, [isEditLoading]);

    useEffect(() => {
        if (isEditSuccess) {
            dispatch(setSnackbar({
                message: "Department updated successfully"
            }))
            navigate(RouteList.departments);
        }
    }, [isEditSuccess]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                        minLength: { value: 4, message: "Minimum length is 4" },
                    })}
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
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
        </form>
    );
}

interface DepartmentFormProps {
    formTitle: string;
    initialData?: NewDepartment;
}

interface NewDepartment {
    id?: number | string;
    name: string;
}
