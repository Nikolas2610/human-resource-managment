import {
    Box,
    Button,
    FormControlLabel,
    Grid,
    Stack,
    Switch,
    TextField,
    Tooltip,
} from "@mui/material";
import RouteList from "@/routes/RouteList";
import FlexCenter from "../../../components/ui/wrappers/FlexCenter";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import HeaderPageBackFeature from "@/components/ui/HeaderPageBackFeature";
import { generateRequiredErrorMessage } from "@/utils/functions";
import { TogglePasswordField } from "@/components/ui/form/TogglePasswordField";
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
    useUpdateEmployeeMutation,
} from "../employeesEndpoints";
import { UserRole } from "@/features/auth/enums/UserRole";
import {
    capitalizeFirstLetter,
    toMysqlFormat,
} from "@/utils/helpers/functions";
import { useGetLeaveTypesQuery } from "@/features/leave-types/leaveTypesEndpoints";
import AddLeaveTypes from "./AddLeaveTypes";
import { useHandleMutation } from "@/hooks/useHandleMutation";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TypeOfJob } from "../enums/TypeOfJob.enum";
import ImageUploadField from "@/components/ui/form/ImageUploadField";

export default function EmployeeForm({
    formTitle,
    initialData,
    employeeId,
}: EmployeeFormProps) {
    const companyId = useSelector(selectCompany);
    const {
        register,
        control,
        handleSubmit,
        watch,
        getValues,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        defaultValues: initialData,
    });
    const passwordRef = useRef({});
    const { data: departments = [], isLoading: isDepartmentLoading } =
        useGetDepartmentsQuery(companyId) as {
            data: Department[];
            isLoading: boolean;
        };
    const { data: positions = [], isLoading: isPositionLoading } =
        useGetPositionsQuery(companyId) as {
            data: Position[];
            isLoading: boolean;
        };
    const { data: leaveTypes = [] } =
        useGetLeaveTypesQuery(companyId);

    const selectedDepartmentId = watch("department_id");
    const [filteredPositions, setFilteredPositions] =
        useState<Position[]>(positions);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [
        createEmployee,
        { isLoading: isCreateLoading, isSuccess, isError, error },
    ] = useCreateEmployeeMutation();
    const { data: employees = [], isLoading: isEmployeesLoading } =
        useGetEmployeesQuery(companyId);
    const [
        updateEmployee,
        {
            isLoading: isUpdateLoading,
            isSuccess: isUpdateSuccess,
            isError: isUpdateError,
            error: updateError,
        },
    ] = useUpdateEmployeeMutation();

    const userRoleOptions = Object.entries(UserRole)
        .filter(([key]) => key !== "GUEST")
        .map(([_key, value]) => ({
            id: value,
            title: capitalizeFirstLetter(value),
        }));

    // Hooks
    useHandleMutation({
        isLoading: isCreateLoading,
        isError,
        isSuccess,
        error,
        actionType: "store",
        entityType: "Employee",
        redirectTo: RouteList.employees,
    });
    useHandleMutation({
        isLoading: isUpdateLoading,
        isError: isUpdateError,
        isSuccess: isUpdateSuccess,
        error: updateError,
        actionType: "update",
        entityType: "Employee",
        redirectTo: RouteList.employees,
    });

    useEffect(() => {
        if (!isDepartmentLoading && !isPositionLoading) {
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
        }
    }, [selectedDepartmentId, positions]);

    const onSubmit = (data: NewEmployee) => {
        const formData = new FormData();

        for (const [key, value] of Object.entries(data)) {
            if (value instanceof Date) {
                // Format Date objects
                formData.append(key, value.toISOString());
            } else if (key === "image") {
                formData.append(key, profilePicture ?? "");
            } else if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else if (
                typeof value === "boolean" ||
                typeof value === "number"
            ) {
                // Convert boolean and number to string
                formData.append(key, value.toString());
            } else if (value instanceof File) {
                // Append files directly
                console.log("\x1b[32m%s\x1b[0m", key);
                
                formData.append(key, value, value.name);
            } else if (value !== null && value !== undefined) {
                if (
                    key === "work_start_date" ||
                    key === "birthday" ||
                    key === "name_day"
                ) {
                    console.log("\x1b[32m%s\x1b[0m", key);
                    formData.append(key, toMysqlFormat(value.toISOString()));
                } else {
                    formData.append(key, String(value));
                }
                if (key === "reports_to") {
                    console.log(value === "");
                }
            }
        }

        if (initialData) {
            if (employeeId) {
                formData.delete("password");
                formData.delete("password_confirmation");
                console.log(formData.get("image"));
                
                if (!profilePicture) {
                    formData.delete("image");
                }
                

                updateEmployee({
                    companyId,
                    employeeId,
                    employee: formData,
                });
            }
        } else {
            createEmployee({ companyId, employee: formData });
        }
    };

    return (
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
            {!isDepartmentLoading &&
            !isPositionLoading &&
            !isEmployeesLoading ? (
                <Stack gap={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                                            generateRequiredErrorMessage(
                                                "First name"
                                            ),
                                    })}
                                    error={Boolean(errors.first_name)}
                                    helperText={errors.first_name?.message}
                                    defaultValue={
                                        initialData
                                            ? initialData.first_name
                                            : ""
                                    }
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
                                            generateRequiredErrorMessage(
                                                "Last name"
                                            ),
                                    })}
                                    error={Boolean(errors.last_name)}
                                    helperText={errors.last_name?.message}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Company Email"
                                    placeholder="Company Email"
                                    {...register("email", {
                                        required:
                                            generateRequiredErrorMessage(
                                                "Email"
                                            ),
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    error={Boolean(errors.email)}
                                    helperText={errors.email?.message}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Personal Email"
                                    placeholder="Personal Email"
                                    {...register("personal_email", {
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    error={Boolean(errors.personal_email)}
                                    helperText={errors.personal_email?.message}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Address"
                                    placeholder="Address"
                                    {...register("address", {
                                        required:
                                            generateRequiredErrorMessage(
                                                "Address"
                                            ),
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
                                        required:
                                            generateRequiredErrorMessage(
                                                "Phone"
                                            ),
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
                                            passwordRef.current =
                                                e.target.value;
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
                                        defaultValue={
                                            initialData?.department_id
                                        }
                                        rules={{
                                            required: "Department is required",
                                        }}
                                        options={departments}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        isDisabled={
                                            isUpdateLoading || isCreateLoading
                                        }
                                        label="Department"
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {filteredPositions.length > 0 ? (
                                    <SelectField
                                        name="position_id"
                                        control={control}
                                        rules={{
                                            required: "Position is required",
                                        }}
                                        options={filteredPositions}
                                        getOptionLabel={(option) =>
                                            option.title
                                        }
                                        getOptionValue={(option) => option.id}
                                        defaultValue={initialData?.position_id}
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
                                                    required:
                                                        "Position is required",
                                                }}
                                                defaultValue={
                                                    initialData?.position_id
                                                }
                                                options={[]}
                                                getOptionLabel={(option) =>
                                                    option.title
                                                }
                                                getOptionValue={(option) =>
                                                    option.id
                                                }
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
                                        getOptionLabel={(option) =>
                                            option.title
                                        }
                                        getOptionValue={(option) => option.id}
                                        label="Reports To"
                                    />
                                )}
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="work_start_date"
                                    control={control}
                                    defaultValue={null}
                                    rules={{
                                        required: "Work Start Date is required",
                                    }}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Work Start Date"
                                            value={field.value}
                                            format="DD-MM-YYYY"
                                            onChange={(newValue) => {
                                                field.onChange(newValue);
                                                setValue(
                                                    "work_start_date",
                                                    newValue
                                                );
                                            }}
                                            slotProps={{
                                                textField: {
                                                    variant: "outlined",
                                                    error: Boolean(
                                                        errors?.work_start_date
                                                    ),
                                                    helperText:
                                                        errors?.work_start_date
                                                            ?.message,
                                                },
                                            }}
                                            sx={{ width: "100%" }}
                                        />
                                    )}
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

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="birthday"
                                    control={control}
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Birthday"
                                            value={field.value}
                                            format="DD-MM-YYYY"
                                            onChange={(newValue) => {
                                                field.onChange(newValue);
                                                setValue("birthday", newValue);
                                            }}
                                            slotProps={{
                                                textField: {
                                                    variant: "outlined",
                                                    error: Boolean(
                                                        errors?.birthday
                                                    ),
                                                    helperText:
                                                        errors?.birthday
                                                            ?.message,
                                                },
                                            }}
                                            sx={{ width: "100%" }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="name_day"
                                    control={control}
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Name Day"
                                            value={field.value}
                                            format="DD-MM-YYYY"
                                            onChange={(newValue) => {
                                                field.onChange(newValue);
                                                setValue("name_day", newValue);
                                            }}
                                            slotProps={{
                                                textField: {
                                                    variant: "outlined",
                                                    error: Boolean(
                                                        errors?.name_day
                                                    ),
                                                    helperText:
                                                        errors?.name_day
                                                            ?.message,
                                                },
                                            }}
                                            sx={{ width: "100%" }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <SelectField
                                    name="type_of_job"
                                    control={control}
                                    rules={{}}
                                    defaultValue={
                                        initialData?.type_of_job ??
                                        TypeOfJob.ON_SITE
                                    }
                                    options={[
                                        {
                                            id: TypeOfJob.ON_SITE,
                                            title: "On Site",
                                        },
                                        {
                                            id: TypeOfJob.WORKING_FROM_HOME,
                                            title: "Working From Home",
                                        },
                                        {
                                            id: TypeOfJob.HYBRID,
                                            title: "Hybrid",
                                        },
                                    ]}
                                    getOptionLabel={(option) => option.title}
                                    getOptionValue={(option) => option.id}
                                    isDisabled={
                                        isUpdateLoading || isCreateLoading
                                    }
                                    label="Type of Job"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    defaultValue={0}
                                    type={"number"}
                                    label="Childs"
                                    placeholder="Childs"
                                    {...register("childs_count")}
                                    error={Boolean(errors.childs_count)}
                                    helperText={errors.childs_count?.message}
                                />
                            </Grid>
                        </Grid>

                        <Box display={"flex"} gap={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        defaultChecked={Boolean(
                                            initialData?.married ?? true
                                        )}
                                        {...register("married")}
                                    />
                                }
                                label="Married"
                            />
                        </Box>

                        <Box display={"flex"} gap={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        defaultChecked={Boolean(
                                            initialData?.active ?? true
                                        )}
                                        {...register("active")}
                                    />
                                }
                                label="Active Employee"
                            />
                        </Box>

                        <AddLeaveTypes
                            register={register}
                            control={control}
                            getValues={getValues}
                            errors={errors}
                            setValue={setValue}
                            leaveTypes={leaveTypes}
                            initialData={initialData?.leave_types ?? []}
                        />

                        <ImageUploadField
                            control={control}
                            setValue={setValue}
                            errors={errors}
                            name={"image"}
                            label="Upload Image"
                            defaultValue={initialData?.image ?? null}
                            setError={setError}
                            clearErrors={clearErrors}
                            setFile={(file) => setProfilePicture(file)}
                            title={"Profile Picture"}
                        />

                        <FlexCenter>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={isUpdateLoading || isCreateLoading}
                            >
                                Submit
                            </Button>
                        </FlexCenter>
                    </LocalizationProvider>
                </Stack>
            ) : (
                "Loading form..."
            )}
        </Box>
    );
}

interface EmployeeFormProps {
    formTitle: string;
    initialData?: NewEmployee;
    employeeId?: number | null;
}
