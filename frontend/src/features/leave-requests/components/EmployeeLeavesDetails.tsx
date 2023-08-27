import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import { EmployeeLeaves } from "@/types/leave-types/EmployeeLeaves.type";
import { Typography, useTheme } from "@mui/material";

export default function EmployeeLeavesDetails({
    watchedField,
    employeeLeaves,
}: EmployeeLeavesDetailsProps) {
    const theme = useTheme();
    const leave = employeeLeaves.find((leave) => leave.id === watchedField);
    const spanStyle = {
        color: theme.palette.primary.main,
        marginLeft: "4px",
    };

    return (
        <>
            {watchedField && leave && (
                <FlexBetween
                    border={1}
                    p={2}
                    mt={2}
                    borderColor={"gray"}
                    borderRadius={2}
                    bgcolor={"white"}
                    color={"black"}
                >
                    <Typography>
                        Default leaves :
                        <span style={spanStyle}>{leave?.leave_amount}</span>
                    </Typography>
                    <Typography>
                        Used leaves :
                        <span style={spanStyle}>{leave?.used_leaves}</span>
                    </Typography>
                    <Typography>
                        Available leaves :
                        <span style={spanStyle}>{leave?.remaining_leaves}</span>
                    </Typography>
                </FlexBetween>
            )}
        </>
    );
}

interface EmployeeLeavesDetailsProps {
    watchedField: string | number;
    employeeLeaves: EmployeeLeaves[];
}
