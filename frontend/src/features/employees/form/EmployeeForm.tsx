import { Box, Button, Grid, Stack, TextField, Tooltip } from "@mui/material";
import RouteList from "@/routes/RouteList";
import FlexCenter from "../../../components/ui/wrappers/FlexCenter";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import HeaderPageBackFeature from "@/components/ui/HeaderPageBackFeature";
import { generateRequiredErrorMessage } from "@/utils/functions";
import { TogglePasswordField } from "@/components/ui/form/TooglePasswordField";
import { useGetDepartmentsQuery } from "@/features/departments/departmentEndpoints";
import { selectCompany } from "@/features/auth/authSlice";
import { useGetPositionsQuery } from "@/features/positions/positionsEndpoints";
import SelectField from "@/components/ui/form/SelectField";
import { Department } from "@/types/departments/Department.type";
import { Position } from "@/types/positions/Position.type";
import { NewEmployee } from "@/types/employee/NewEmployee.type";
import {
    useCreateEmployeeMutation,
    useGetEmployeesQuery,
} from "../employeesEndpoints";
import { useHandleServerError } from "@/hooks/useHandleServerError";
import useToggleDashboardLoading from "@/hooks/useToggleDashboardLoading";
import useSuccessSnackbar from "@/hooks/useSuccessSnackbar";
import generateResponseMessage from "@/utils/helpers/generateResponseMessage";
import { UserRole } from "@/features/auth/enums/UserRole";
import { capitalizeFirstLetter } from "@/utils/helpers/functions";

export default function EmployeeForm({
    formTitle,
    initialData,
}: EmployeeFormProps) {
    const companyId = useSelector(selectCompany);
    const [cleanedInitialData, setCleanInitialData] = useState<any>();

    useEffect(() => {
        if (initialData) {
            const {
                password,
                password_confirmation,
                ...cleanedData
            } = initialData;
            setCleanInitialData(cleanedData);
            console.log(cleanedData);
            
        }
    }, [initialData]); 

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: initialData,
    });
    const passwordRef = useRef({});
    const { data: departments = [] } = useGetDepartmentsQuery(companyId) as {
        data: Department[];
    };
    const { data: positions = [] } = useGetPositionsQuery(companyId) as {
        data: Position[];
    };
    const selectedDepartmentId = watch("department_id");
    const [filteredPositions, setFilteredPositions] =
        useState<Position[]>(positions);

    const [
        createEmployee,
        { isLoading: isCreateLoading, isSuccess, isError, error },
    ] = useCreateEmployeeMutation();
    const { data: employees = [] } = useGetEmployeesQuery(companyId);

    const userRoleOptions = Object.entries(UserRole)
        .filter(([key]) => key !== "GUEST")
        .map(([key, value]) => ({
            id: value,
            title: capitalizeFirstLetter(value),
        }));

    // Hooks
    useHandleServerError(isError, error);
    useToggleDashboardLoading(isCreateLoading);
    useSuccessSnackbar({
        isSuccess,
        message: generateResponseMessage("Employee", "store"),
        to: RouteList.employees,
    });

    useEffect(() => {
        if (selectedDepartmentId) {
            setFilteredPositions(
                positions.filter(
                    (position) =>
                        position.department.id === selectedDepartmentId
                )
            );
        } else {
            setFilteredPositions([]);
        }
    }, [selectedDepartmentId, positions]);
    // const [
    //     editDepartment,
    //     { isLoading: isEditLoading, isSuccess: isEditSuccess },
    // ] = useEditDepartmentMutation();

    const onSubmit = (data: NewEmployee) => {
        if (initialData) {
            console.log(data);

            const { password, password_confirmation, ...cleanData } = data;
            const typedCleanData = cleanData as Test;
            console.log("🚀 ~ file: EmployeeForm.tsx:113 ~ onSubmit ~ typedCleanData:", typedCleanData)
            
             

            // editDepartment({
            //     companyId,
            //     department: { id: initialData.id, ...data },
            // });
        } else {
            createEmployee({ companyId, employee: data });
            console.log(data);
        }
    };

    // useEffect(() => {
    //     dispatch(toggleDashboardLoading(isEditLoading));
    // }, [isEditLoading]);

    // useEffect(() => {
    //     if (isEditSuccess) {
    //         dispatch(
    //             setSnackbar({
    //                 message: "Department updated successfully",
    //             })
    //         );
    //         navigate(RouteList.departments);
    //     }
    // }, [isEditSuccess]);

    return (
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4}>
                <HeaderPageBackFeature
                    headerTitle={formTitle}
                    to={RouteList.employees}
                    buttonTitle="Back to Employees"
                />

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="First Name"
                            placeholder="First Name"
                            {...register("first_name", {
                                required:
                                    generateRequiredErrorMessage("First name"),
                            })}
                            error={Boolean(errors.first_name)}
                            helperText={errors.first_name?.message}
                            defaultValue={initialData ? initialData.first_name : ""}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Last Name"
                            placeholder="Last Name"
                            {...register("last_name", {
                                required:
                                    generateRequiredErrorMessage("Last name"),
                            })}
                            error={Boolean(errors.last_name)}
                            helperText={errors.last_name?.message}
                        />
                    </Grid>
                </Grid>

                <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    placeholder="Email"
                    {...register("email", {
                        required: generateRequiredErrorMessage("Email"),
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: "Invalid email address",
                        },
                    })}
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                />

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Address"
                            placeholder="Address"
                            {...register("address", {
                                required:
                                    generateRequiredErrorMessage("Address"),
                            })}
                            error={Boolean(errors.address)}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Phone"
                            placeholder="Phone"
                            {...register("phone", {
                                required: generateRequiredErrorMessage("Phone"),
                            })}
                            error={Boolean(errors.phone)}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>

                {!initialData && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TogglePasswordField
                                control={control}
                                name="password"
                                label="Password"
                                placeholder="Enter your password"
                                rules={{
                                    required:
                                        generateRequiredErrorMessage(
                                            "Password"
                                        ),
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Password must have at least 8 characters",
                                    },
                                    maxLength: {
                                        value: 24,
                                        message:
                                            "Password can't be longer than 24 characters",
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8,24}$/,
                                        message:
                                            "Password must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character",
                                    },
                                }}
                                errorObject={errors}
                                onChange={(e) => {
                                    passwordRef.current = e.target.value;
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TogglePasswordField
                                control={control}
                                name="password_confirmation"
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                rules={{
                                    required:
                                        generateRequiredErrorMessage(
                                            "Confirm Password"
                                        ),
                                    validate: (value: string) =>
                                        value === passwordRef.current ||
                                        "The passwords do not match",
                                }}
                                errorObject={errors}
                            />
                        </Grid>
                    </Grid>
                )}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        {departments?.length > 0 && (
                            <SelectField
                                name="department_id"
                                control={control}
                                defaultValue={initialData?.department_id}
                                rules={{ required: "Department is required" }}
                                options={departments}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                errorObject={errors}
                                // isDisabled={isEditLoading || isCreateLoading}
                                label="Department"
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {filteredPositions.length > 0 ? (
                            <SelectField
                                name="position_id"
                                control={control}
                                rules={{ required: "Position is required" }}
                                options={filteredPositions}
                                getOptionLabel={(option) => option.title}
                                getOptionValue={(option) => option.id}
                                defaultValue={initialData?.position_id}
                                errorObject={errors}
                                label="Position"
                            />
                        ) : (
                            <Tooltip
                                title="Please select a department first."
                                placement="top"
                            >
                                <span>
                                    <SelectField
                                        name="position_id"
                                        control={control}
                                        rules={{
                                            required: "Position is required",
                                        }}
                                        defaultValue={initialData?.position_id}
                                        options={[]}
                                        getOptionLabel={(option) =>
                                            option.title
                                        }
                                        getOptionValue={(option) => option.id}
                                        errorObject={errors}
                                        label="Position"
                                        isDisabled={true}
                                    />
                                </span>
                            </Tooltip>
                        )}
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <SelectField
                            name="role"
                            control={control}
                            rules={{ required: "Role is required" }}
                            options={userRoleOptions}
                            getOptionLabel={(option) => option.title}
                            getOptionValue={(option) => option.id}
                            errorObject={errors}
                            label="User Role"
                            defaultValue={
                                initialData
                                    ? initialData?.role
                                    : UserRole.EMPLOYEE
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {employees.length > 0 && (
                            <SelectField
                                name="reports_to"
                                control={control}
                                rules={{}}
                                options={[
                                    { id: null, title: "None" },
                                    ...employees.map((employee) => ({
                                        id: employee.id,
                                        title: `${employee.first_name} ${employee.last_name}`,
                                    })),
                                ]}
                                defaultValue={initialData?.reports_to}
                                getOptionLabel={(option) => option.title}
                                getOptionValue={(option) => option.id}
                                errorObject={errors}
                                label="Reports To"
                            />
                        )}
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            type="date"
                            variant="outlined"
                            label="Work Start Date"
                            placeholder="Work Start Date"
                            {...register("work_start_date", {
                                required:
                                    generateRequiredErrorMessage(
                                        "Work Start Date"
                                    ),
                            })}
                            error={Boolean(errors.work_start_date)}
                            helperText={errors.work_start_date?.message}
                            sx={{
                                '& input[type="date"]::-webkit-calendar-picker-indicator':
                                    {
                                        filter: "invert(1)",
                                    },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Salary"
                            type="number"
                            defaultValue={0}
                            placeholder="Salary"
                            {...register("salary", {
                                pattern: {
                                    value: /^\d+(\.\d{1,2})?$/, // Matches integers and decimals up to two decimal places
                                    message: "Invalid Salary format", // Custom message for the pattern validation
                                },
                            })}
                            error={Boolean(errors.salary)}
                            helperText={errors.salary?.message}
                            inputProps={{
                                inputMode: "decimal",
                                step: "0.01",
                            }}
                        />
                    </Grid>
                </Grid>

                <FlexCenter>
                    <Button
                        variant="contained"
                        type="submit"
                        // disabled={isEditLoading || isCreateLoading}
                    >
                        Submit
                    </Button>
                </FlexCenter>
            </Stack>
        </Box>
    );
}

interface Test {
    first_name: string;
    last_name: string;
    address: string;
    phone: number;
    work_start_date: Date;
    email: string;
    department_id: number;
    position_id: number;
    companyId: number;
    role: UserRole,
    salary?: number;
    reports_to?: number;
}

interface EmployeeFormProps {
    formTitle: string;
    initialData?: NewEmployee;
}
