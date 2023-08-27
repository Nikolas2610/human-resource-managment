import HeaderPageAddFeature from "@/components/ui/HeaderPageAddFeature";
import SelectField from "@/components/ui/form/SelectField";
import { selectCompany } from "@/features/auth/authSlice";
import { useGetEmployeeLeavesQuery } from "@/features/leave-types/leaveTypesEndpoints";
import useToggleDashboardLoading from "@/hooks/useToggleDashboardLoading";
import { generateRequiredErrorMessage } from "@/utils/functions";
import { Alert, Box, Button, Grid, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Controller } from "react-hook-form";
import { NewLeaveRequest } from "@/types/leave-requests/NewLeaveRequest.type";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import EmployeeLeavesDetails from "../components/EmployeeLeavesDetails";
import dayjs from "dayjs";
import { useCreateLeaveRequestMutation } from "../leaveRequestsEndpoints";
import { useHandleMutation } from "@/hooks/useHandleMutation";
import { toMysqlFormat } from "@/utils/helpers/functions";
import RouteList from "@/routes/RouteList";

export default function LeaveRequestForm() {
    const companyId = useSelector(selectCompany);
    // Queries
    const { data: employeeLeaves = [], isLoading: isDataLoading } =
        useGetEmployeeLeavesQuery(companyId);
    const [
        createLeaveType,
        {
            isSuccess: isCreateSuccess,
            isLoading: isCreateLoading,
            isError: isCreateError,
            error: errorCreateLeaveRequest,
        },
    ] = useCreateLeaveRequestMutation();

    // Custom Hooks
    useToggleDashboardLoading(isDataLoading);

    useHandleMutation({
        isLoading: isCreateLoading,
        isSuccess: isCreateSuccess,
        isError: isCreateError,
        error: errorCreateLeaveRequest,
        entityType: "Leave request",
        actionType: "store",
        redirectTo: RouteList.dashboard,
    });
    // useForm
    const {
        register,
        handleSubmit,
        setValue,
        control,
        getValues,
        watch,
        formState: { errors },
    } = useForm<NewLeaveRequest>();
    const [minEndDate, setMinEndDate] = useState(new Date());

    const watchedField = watch("leave_type_id"); // watching the value of 'leave_type_id'

    const onSubmit = (data: NewLeaveRequest) => {
        const { start_date, end_date } = data;
        if (start_date && end_date) {
            const mysqlStartDate = toMysqlFormat(start_date.toISOString());
            const mysqlEndDate = toMysqlFormat(end_date.toISOString());

            const formattedData = {
                ...data,
                start_date: mysqlStartDate,
                end_date: mysqlEndDate,
            };

            createLeaveType({
                leaveRequest: formattedData,
                companyId,
            });
        }
    };

    // Loading
    if (isDataLoading) {
        return <>Loading...</>;
    }

    return (
        <>
            <HeaderPageAddFeature headerTitle="Post Leave Request" />
            {!isDataLoading &&
                (employeeLeaves?.length > 0 ? (
                    <Stack
                        component={"form"}
                        mt={4}
                        gap={4}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Box>
                            <SelectField
                                name="leave_type_id"
                                control={control}
                                rules={{
                                    required:
                                        generateRequiredErrorMessage(
                                            "Leave type"
                                        ),
                                }}
                                options={employeeLeaves.map(({ id, type }) => ({
                                    id,
                                    title: type,
                                }))}
                                getOptionLabel={(option) => option.title}
                                getOptionValue={(option) => option.id}
                                errorObject={errors}
                                // isDisabled={isEditLoading || isCreateLoading}
                                label="Leave Type"
                            />
                            <EmployeeLeavesDetails
                                watchedField={watchedField}
                                employeeLeaves={employeeLeaves}
                            />
                        </Box>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={6}>
                                    <Controller
                                        name="start_date"
                                        control={control}
                                        rules={{
                                            required: "Start date is required",
                                        }}
                                        defaultValue={null}
                                        render={({ field }) => (
                                            <DatePicker
                                                label="Start Date"
                                                value={field.value}
                                                format="DD-MM-YYYY"
                                                onChange={(newValue) => {
                                                    field.onChange(newValue);
                                                    setValue(
                                                        "start_date",
                                                        newValue
                                                    );
                                                    if (newValue) {
                                                        setMinEndDate(
                                                            new Date(
                                                                newValue.toISOString()
                                                            )
                                                        );
                                                    }

                                                    // Calculate the difference and update the 'days_requested' field
                                                    const endDate =
                                                        getValues("end_date");
                                                    if (endDate && newValue) {
                                                        let currentDay =
                                                            dayjs(newValue);
                                                        const endDay =
                                                            dayjs(endDate);
                                                        let difference = 0;

                                                        while (
                                                            currentDay <= endDay
                                                        ) {
                                                            const dayOfWeek =
                                                                currentDay.day();
                                                            // day() returns 0 for Sunday and 6 for Saturday
                                                            if (
                                                                dayOfWeek !==
                                                                    0 &&
                                                                dayOfWeek !== 6
                                                            ) {
                                                                difference++;
                                                            }
                                                            currentDay =
                                                                currentDay.add(
                                                                    1,
                                                                    "day"
                                                                );
                                                        }

                                                        setValue(
                                                            "days_requested",
                                                            difference
                                                        );
                                                    }
                                                }}
                                                minDate={dayjs(new Date())}
                                                slotProps={{
                                                    textField: {
                                                        variant: "outlined",
                                                        error: Boolean(
                                                            errors?.start_date
                                                        ),
                                                        helperText:
                                                            errors?.start_date
                                                                ?.message,
                                                    },
                                                }}
                                                sx={{ width: "100%" }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Controller
                                        name="end_date"
                                        control={control}
                                        defaultValue={null}
                                        rules={{
                                            required: "End date is required",
                                            validate: (value) => {
                                                const startDate =
                                                    getValues("start_date");
                                                if (
                                                    value &&
                                                    startDate &&
                                                    value <= startDate
                                                ) {
                                                    return "End date must be after Start date";
                                                }
                                                return true;
                                            },
                                        }}
                                        render={({ field }) => (
                                            <DatePicker
                                                label="End Date"
                                                value={field.value}
                                                format="DD-MM-YYYY"
                                                minDate={dayjs(
                                                    getValues("start_date") ||
                                                        minEndDate
                                                )}
                                                onChange={(newValue) => {
                                                    field.onChange(newValue);
                                                    setValue(
                                                        "end_date",
                                                        newValue
                                                    );

                                                    // Calculate the difference and update the 'days_requested' field
                                                    const startDate =
                                                        getValues("start_date");
                                                    if (startDate && newValue) {
                                                        let currentDay =
                                                            dayjs(startDate);
                                                        const endDay =
                                                            dayjs(newValue);
                                                        let difference = 0;

                                                        while (
                                                            currentDay <= endDay
                                                        ) {
                                                            const dayOfWeek =
                                                                currentDay.day();
                                                            // day() returns 0 for Sunday and 6 for Saturday
                                                            if (
                                                                dayOfWeek !==
                                                                    0 &&
                                                                dayOfWeek !== 6
                                                            ) {
                                                                difference++;
                                                            }
                                                            currentDay =
                                                                currentDay.add(
                                                                    1,
                                                                    "day"
                                                                );
                                                        }

                                                        setValue(
                                                            "days_requested",
                                                            difference
                                                        );
                                                    }
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        variant: "outlined",
                                                        error: Boolean(
                                                            errors?.end_date
                                                        ),
                                                        helperText:
                                                            errors?.end_date
                                                                ?.message,
                                                    },
                                                }}
                                                sx={{ width: "100%" }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </LocalizationProvider>

                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Reason"
                            placeholder="Reason"
                            multiline
                            rows={4}
                            {...register("reason", {
                                required:
                                    generateRequiredErrorMessage("Reason"),
                            })}
                            error={Boolean(errors.reason)}
                            helperText={errors?.reason?.message}
                        />
                        <Controller
                            name="days_requested"
                            control={control}
                            defaultValue={0}
                            rules={{
                                required: "Days Requested is required",
                            }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    label="Days Requested"
                                    placeholder="Days Requested"
                                    {...field}
                                    error={Boolean(errors.days_requested)}
                                    helperText={errors?.days_requested?.message}
                                />
                            )}
                        />

                        <FlexCenter>
                            <Button
                                variant="contained"
                                type="submit"
                                // disabled={isUpdateLoading || isCreateLoading}
                            >
                                Submit
                            </Button>
                        </FlexCenter>
                    </Stack>
                ) : (
                    // TODO: Company email
                    <Alert severity="info" sx={{ my: 4 }}>
                        No data. Please contact the support team!
                    </Alert>
                ))}
        </>
    );
}
