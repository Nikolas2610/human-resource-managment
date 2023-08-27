import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import { LeaveRequest } from "@/types/leave-requests/LeaveRequest.type";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Typography,
} from "@mui/material";
import LeaveRequestStatusChip from "./LeaveRequestStatusChip";
import {
    capitalizeFirstLetter,
    convertToDDMMYYYY,
    formattedDateFrontend,
    getManagerStatus,
} from "@/utils/helpers/functions";
import LeaveRequestDetails from "./LeaveRequestDetails";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import { LeaveRequestStatus } from "../enums/LeaveRequestStatus.enum";
import { useUpdateLeaveRequestStatusMutation } from "../leaveRequestsEndpoints";
import { useHandleMutation } from "@/hooks/useHandleMutation";
import { LeaveRequestApprovalStatus } from "../enums/LeaveRequestApprovalStatus.enum";
import { useSelector } from "react-redux";
import { selectUserID, selectUserRole } from "@/features/auth/authSlice";
import { UserRole } from "@/features/auth/enums/UserRole";
import { Company } from "@/types/companies/Company.type";

export default function ManagerLeaveRequestsAccordion({
    leave,
    company,
}: ManagerLeaveRequestsAccordionProps) {
    const [updateLeaveRequestStatus, { isLoading, isError, error, isSuccess }] =
        useUpdateLeaveRequestStatusMutation();
    const userRole = useSelector(selectUserRole);
    const userId = useSelector(selectUserID);
    const approvalField =
        userRole === UserRole.HR ? "hr_approved" : "manager_approved";

    const handleUpdateLeaveRequestStatus = (
        status: LeaveRequestApprovalStatus
    ) => {
        const formattedData = {
            status,
        };
        updateLeaveRequestStatus({
            leaveRequest: formattedData,
            leaveRequestId: leave.id,
            companyId: company.id,
        });
    };

    useHandleMutation({
        isLoading,
        isSuccess,
        isError,
        error,
        entityType: "Update request",
        actionType: "update",
        redirectTo: "",
    });

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <FlexBetween
                    display={"flex"}
                    gap={2}
                    alignItems={"center"}
                    pr={2}
                    sx={{ width: "100%" }}
                >
                    <Box display="flex" gap={1}>
                        <Typography variant="h4">
                            {capitalizeFirstLetter(leave.employee_name)}
                        </Typography>
                        {leave.employee_id === userId && (
                            <Typography color={"primary"}>[ME]</Typography>
                        )}
                    </Box>
                    <LeaveRequestStatusChip status={leave.status} />
                </FlexBetween>
            </AccordionSummary>
            <AccordionDetails>
                <LeaveRequestDetails fieldName="Leave Type" firstElement>
                    {leave.leave_type_name}
                </LeaveRequestDetails>
                <LeaveRequestDetails fieldName="Days Requested">
                    {leave.days_requested}
                </LeaveRequestDetails>
                <LeaveRequestDetails fieldName="Start Date">
                    {convertToDDMMYYYY(leave.start_date)}
                </LeaveRequestDetails>
                <LeaveRequestDetails fieldName="End Date">
                    {convertToDDMMYYYY(leave.end_date)}
                </LeaveRequestDetails>
                {company.require_manager_approval && (
                    <LeaveRequestDetails fieldName="Manager Approved">
                        <LeaveRequestStatusChip
                            status={getManagerStatus(leave.manager_approved)}
                        />
                    </LeaveRequestDetails>
                )}
                {company.require_hr_approval && (
                    <LeaveRequestDetails fieldName="HR Approved">
                        <LeaveRequestStatusChip
                            status={getManagerStatus(leave.hr_approved)}
                        />
                    </LeaveRequestDetails>
                )}
                <LeaveRequestDetails fieldName="Reason">
                    {leave.reason}
                </LeaveRequestDetails>
                <LeaveRequestDetails fieldName="Date Leave Request">
                    {formattedDateFrontend(leave.created_at)}
                </LeaveRequestDetails>
                <FlexCenter gap={2} mt={2}>
                    <Button
                        variant="contained"
                        color="error"
                        disabled={
                            getManagerStatus(leave[approvalField]) ===
                            LeaveRequestStatus.REJECTED
                        }
                        onClick={() =>
                            handleUpdateLeaveRequestStatus(
                                LeaveRequestApprovalStatus.REJECTED
                            )
                        }
                    >
                        Reject
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={
                            getManagerStatus(leave[approvalField]) ===
                            LeaveRequestStatus.APPROVED
                        }
                        onClick={() =>
                            handleUpdateLeaveRequestStatus(
                                LeaveRequestApprovalStatus.APPROVED
                            )
                        }
                    >
                        Approve
                    </Button>
                </FlexCenter>
            </AccordionDetails>
        </Accordion>
    );
}

interface ManagerLeaveRequestsAccordionProps {
    leave: LeaveRequest;
    company: Company;
}
