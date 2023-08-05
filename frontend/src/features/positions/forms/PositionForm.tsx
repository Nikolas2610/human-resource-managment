import { RootState } from "@/app/store";
import HeaderPageBackFeature from "@/components/ui/HeaderPageBackFeature";
import { useGetDepartmentsQuery } from "@/features/departments/departmentEndpoints";
import RouteList from "@/routes/RouteList";
import {
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "@mui/material/Select";
import { Department } from "@/types/departments/Department.type";
import { Controller } from "react-hook-form";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import {
    useCreatePositionMutation,
    useEditPositionMutation,
} from "../positionsEndpoints";
import { useEffect } from "react";
import { toggleDashboardLoading } from "@/features/dashboard/dashboardSlice";
import { useNavigate } from "react-router-dom";
import { Position } from "@/types/positions/Position.type";
import { setSnackbar } from "@/features/snackbars/snackbarSlice";

export default function PositionForm({
    formTitle,
    initialData,
}: PositionFormProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const companyId =
        useSelector((state: RootState) => state.auth.user?.company_id) || 0;
    const { data: departments = [] } = useGetDepartmentsQuery(companyId) as {
        data: Department[];
    };
    const [createPosition, { isLoading: isCreateLoading, isSuccess }] =
        useCreatePositionMutation();
    const [
        editPosition,
        { isLoading: isEditLoading, isSuccess: isEditSuccess },
    ] = useEditPositionMutation();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: initialData ?? { title: "", department: { id: "" } },
    });

    useEffect(() => {
        dispatch(toggleDashboardLoading(isCreateLoading));
    }, [isCreateLoading]);

    useEffect(() => {
        if (isSuccess) {
            dispatch(setSnackbar({
                message: "Position created successfully"
            }))
            navigate(RouteList.positions);
        }
    }, [isSuccess]);

    useEffect(() => {
        dispatch(toggleDashboardLoading(isEditLoading));
    }, [isEditLoading]);

    useEffect(() => {
        if (isEditSuccess) {
            dispatch(setSnackbar({
                message: "Position updated successfully"
            }))
            navigate(RouteList.positions);
        }
    }, [isEditSuccess]);

    const onSubmit = (data: NewPosition) => {
        if (initialData) {
            editPosition({
                companyId,
                position: {
                    id: initialData.id,
                    department_id: data.department.id,
                    title: data.title,
                },
            });
        } else {
            createPosition({
                companyId,
                position: {
                    department_id: data.department.id,
                    title: data.title,
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
                <HeaderPageBackFeature
                    headerTitle={formTitle}
                    to={RouteList.positions}
                    buttonTitle="Back to Positions"
                />

                <TextField
                    variant="outlined"
                    label="Name"
                    disabled={isEditLoading || isCreateLoading}
                    placeholder="Write the title of the position"
                    {...register("title", {
                        required: "Name is required",
                    })}
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                />

                <Controller
                    name="department.id"
                    control={control}
                    rules={{ required: "Department is required" }}
                    // defaultValue={undefined}
                    render={({
                        field: { onChange, value },
                        fieldState: { error },
                    }) => (
                        <FormControl
                            fullWidth
                            error={!!error}
                            disabled={isEditLoading || isCreateLoading}
                        >
                            <InputLabel id="demo-simple-select-label">
                                Department
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Department"
                                onChange={onChange}
                                value={value}
                            >
                                {departments.length > 0 &&
                                    departments.map((department) => (
                                        <MenuItem
                                            key={department.id}
                                            value={department.id}
                                        >
                                            {department.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                            <FormHelperText>{error?.message}</FormHelperText>
                        </FormControl>
                    )}
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

interface PositionFormProps {
    formTitle: string;
    initialData?: Position;
}

interface NewPosition {
    title: string;
    department: {
        id: number | string;
    };
}
