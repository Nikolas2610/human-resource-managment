import { LeaveRequestApprovalStatus } from "@/features/leave-requests/enums/LeaveRequestApprovalStatus.enum";
import { LeaveRequestStatus } from "@/features/leave-requests/enums/LeaveRequestStatus.enum";
import dayjs from "dayjs";

export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const getAvatarName = (firstName: string, lastName: string): string => {
    return `${capitalizeFirstLetter(
        firstName.charAt(0)
    )}${capitalizeFirstLetter(lastName.charAt(0))}`;
};

export const formattedDateFrontend = (date: Date) =>
    dayjs(date).format("DD-MM-YYYY");

export const formattedDateDatabase = (date: Date) =>
    dayjs(date).format("YYYY--MM-DD");

export const toMysqlFormat = (isoDateString: string): string => {
    return isoDateString.slice(0, 19).replace("T", " ");
};

export const convertToDDMMYYYY = (isoDateString: string): string => {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

export const getManagerStatus = (
    approval: LeaveRequestApprovalStatus
): LeaveRequestStatus => {
    if (approval === LeaveRequestApprovalStatus.PENDING) {
        return LeaveRequestStatus.PENDING;
    } else {
        if (approval === LeaveRequestApprovalStatus.APPROVED) {
            return LeaveRequestStatus.APPROVED;
        } else {
            return LeaveRequestStatus.REJECTED;
        }
    }
};
