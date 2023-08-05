import { Button, Stack, TextField } from "@mui/material";
import PageTitleBlock from "../../../components/ui/PageTitleBlock";
import RouteList from "@/routes/RouteList";
import FlexCenter from "../../../components/ui/wrappers/FlexCenter";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useEffect } from "react";
import { toggleDashboardLoading } from "@/features/dashboard/dashboardSlice";
import { useNavigate } from "react-router-dom";
import { useCreateDepartmentMutation, useEditDepartmentMutation } from "../departmentEndopoints";

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
                department: { id: initialData.id, ...data },
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
            navigate(RouteList.departments);
        }
    }, [isSuccess]);

    useEffect(() => {
        dispatch(toggleDashboardLoading(isEditLoading));
    }, [isEditLoading]);

    useEffect(() => {
        if (isEditSuccess) {
            navigate(RouteList.departments);
        }
    }, [isEditSuccess]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
                <PageTitleBlock
                    formTitle={formTitle}
                    to={RouteList.departments}
                    buttonText="Back to Departments"
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
                    <Button variant="contained" type="submit">
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
    id?: number;
    name: string;
}
