import { LeaveRequestStatus } from "../enums/LeaveRequestStatus.enum";
import { Chip } from "@mui/material";

export default function LeaveRequestStatusChip({
    status,
}: LeaveRequestStatusChipProps) {
    const color = (status: LeaveRequestStatus) => {
        if (status === LeaveRequestStatus.APPROVED) {
            return "success";
        }
        if (status === LeaveRequestStatus.DONE) {
            return "primary";
        }
        if (status === LeaveRequestStatus.REJECTED) {
            return "error";
        }
        if (status === LeaveRequestStatus.PENDING) {
            return "warning";
        }
    };
    return (
        <>
            <Chip
                label={status.toUpperCase()}
                color={color(status)}
            />
        </>
    );
}

interface LeaveRequestStatusChipProps {
    status: LeaveRequestStatus;
}
