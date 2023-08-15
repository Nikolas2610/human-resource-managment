import HeaderPageBackFeature from "@/components/ui/HeaderPageBackFeature";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import RouteList from "@/routes/RouteList";
import {
    Box,
    Button,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
    useCreateLeaveTypeMutation,
    useUpdateLeaveTypeMutation,
} from "../leaveTypesEndpoints";
import { useSelector } from "react-redux";
import { selectCompany } from "@/features/auth/authSlice";
import { NewLeaveType } from "@/types/leave-types/NewLeaveType.type";
import { useHandleMutation } from "@/hooks/useHandleMutation";
import { useState } from "react";

export default function LeaveTypeForm({
    formTitle,
    initialData,
    leaveTypeId,
}: LeaveTypeFormProps) {
    const companyId = useSelector(selectCompany);
    const [limit, setLimit] = useState<boolean>(
        Boolean(initialData?.limit) ?? false
    ); // Initial state
    const {
        unregister,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: initialData,
    });

    // RTK Queries
    const [
        createLeaveType,
        {
            isSuccess: isCreateSuccess,
            isLoading: isCreateLoading,
            isError: isCreateError,
            error: errorCreateLeaveType,
        },
    ] = useCreateLeaveTypeMutation();
    const [
        updateLeaveType,
        {
            isSuccess: isUpdateSuccess,
            isLoading: isUpdateLoading,
            isError: isUpdateError,
            error: errorUpdateLeaveType,
        },
    ] = useUpdateLeaveTypeMutation();

    // Custom Hooks
    useHandleMutation({
        isLoading: isCreateLoading,
        isSuccess: isCreateSuccess,
        isError: isCreateError,
        error: errorCreateLeaveType,
        entityType: "Leave type",
        actionType: "store",
        redirectTo: RouteList.leaveTypes,
    });

    useHandleMutation({
        isLoading: isUpdateLoading,
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        error: errorUpdateLeaveType,
        entityType: "Leave type",
        actionType: "update",
        redirectTo: RouteList.leaveTypes,
    });

    // Submit form
    const onSubmit = (data: NewLeaveType) => {
        if (leaveTypeId) {
            // Update LeaveType
            updateLeaveType({
                companyId,
                leaveType: {
                    type: data.type,
                    id: leaveTypeId,
                    leave_amount: data.leave_amount,
                    limit: data.limit,
                    visible_to_employees: data.visible_to_employees,
                },
            });
        } else {
            // Store LeaveType
            createLeaveType({ companyId, leaveType: data });
        }
        console.log(data);
    };

    return (
        <>
            <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <HeaderPageBackFeature
                        headerTitle={formTitle}
                        to={RouteList.leaveTypes}
                        buttonTitle="Back to Leave Types"
                    />

                    <TextField
                        variant="outlined"
                        label="Leave Type Name"
                        placeholder="Write the name of the leave type"
                        {...register("type", {
                            required: "Leave Type name is required",
                        })}
                        disabled={isUpdateLoading || isCreateLoading}
                        error={Boolean(errors.type)}
                        helperText={errors.type?.message}
                    />

                    <Box display={"flex"} gap={4}>
                        <FormControlLabel
                            control={
                                <Switch
                                    {...register("limit")}
                                    checked={limit}
                                    onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        unregister("leave_amount");
                                        setLimit(isChecked);
                                    }}
                                />
                            }
                            label="Limit Leave Amounts"
                        />

                        {limit && (
                            <TextField
                                type="number"
                                variant="outlined"
                                label="Leave Amounts"
                                placeholder="Write the amounts of leave"
                                {...register("leave_amount", {
                                    required: "Leave Amounts is required",
                                    min: {
                                        value: 1,
                                        message:
                                            "Leave Amounts should be at least 1.",
                                    },
                                    max: {
                                        value: 365,
                                        message:
                                            "Leave Amounts should not exceed 365.",
                                    },
                                })}
                                disabled={isUpdateLoading || isCreateLoading}
                                error={Boolean(errors.leave_amount)}
                                helperText={errors.leave_amount?.message}
                            />
                        )}
                    </Box>

                    <Box display={"flex"} gap={4}>
                        <FormControlLabel
                            control={
                                <Switch
                                    defaultChecked={
                                        Boolean(
                                            initialData?.visible_to_employees
                                        ) ?? false
                                    }
                                    {...register("visible_to_employees")}
                                />
                            }
                            label="Visible to employees dashboard"
                        />
                    </Box>

                    <FlexCenter>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={isUpdateLoading || isCreateLoading}
                        >
                            Submit
                        </Button>
                    </FlexCenter>
                </Stack>
            </Box>
        </>
    );
}

interface LeaveTypeFormProps {
    formTitle: string;
    initialData?: NewLeaveType;
    leaveTypeId?: number | null;
}
