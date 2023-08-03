import { Button, Stack, TextField } from "@mui/material";
import PageTitleBlock from "../../../components/ui/PageTitleBlock";
import RouteList from "../../../routes/routeList";
import FlexCenter from "../../../components/ui/wrappers/FlexCenter";
import { useForm } from "react-hook-form";
import {
    useCreateDepartmentMutation,
    useEditDepartmentMutation,
} from "../../api/apiService";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

export default function DepartmentForm({
    formTitle,
    initialData,
}: DepartmentFormProps) {
    const companyId =
        useSelector((state: RootState) => state.auth.user?.company_id) || 0;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: initialData,
    });
    const [createDepartment] = useCreateDepartmentMutation();
    const [editDepartment] = useEditDepartmentMutation();

    const onSubmit = (data: Department) => {
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
    initialData?: Department;
}

interface Department {
    id?: number;
    name: string;
}
