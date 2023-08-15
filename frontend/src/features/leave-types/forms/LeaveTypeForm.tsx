import HeaderPageBackFeature from "@/components/ui/HeaderPageBackFeature";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import RouteList from "@/routes/RouteList";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import {
    useCreateLeaveTypeMutation,
    useUpdateLeaveTypeMutation,
} from "../leaveTypesEndpoints";
import { useSelector } from "react-redux";
import { selectCompany } from "@/features/auth/authSlice";
import { NewLeaveType } from "@/types/leave-types/NewLeaveType.type";
import { useHandleMutation } from "@/hooks/useHandleMutation";

export default function LeaveTypeForm({
    formTitle,
    initialData,
    leaveTypeId,
}: LeaveTypeFormProps) {
    const companyId = useSelector(selectCompany);
    const {
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
        redirectTo: RouteList.leaveTypes
    });
    
    useHandleMutation({
        isLoading: isUpdateLoading,
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        error: errorUpdateLeaveType,
        entityType: "Leave type",
        actionType: "update",
        redirectTo: RouteList.leaveTypes
    });

    // Submit form
    const onSubmit = (data: NewLeaveType) => {
        if (leaveTypeId) {
            // Update LeaveType
            updateLeaveType({
                companyId,
                leaveType: { type: data.type, id: leaveTypeId },
            });
        } else {
            // Store LeaveType
            createLeaveType({ companyId, leaveType: data });
        }
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
