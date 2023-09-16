import { NewEmployeeLeaveType } from "@/types/employee/NewEmployeeLeaveType.type";
import { Box, Button, Typography } from "@mui/material";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import { Link } from "react-router-dom";
import RouteList from "@/routes/RouteList";

export default function EmployeeLeaveTypes({
    leaveTypes,
}: EmployeeLeaveTypesProps) {
    return (
        <>
            {leaveTypes.length > 0 &&
                leaveTypes.map((leaveType, index) => (
                    <Box key={index} py={2} borderBottom={2}>
                        <FlexBetween>
                            <Typography variant="h3">
                                {leaveType.leave_type}
                            </Typography>
                            <Box
                                display={"flex"}
                                flexDirection={"column"}
                                alignItems={"end"}
                            >
                                <Typography variant="h4">
                                    Used: {leaveType.used_leaves} days
                                </Typography>
                                <Typography variant="h4">
                                    Remaining:{" "}
                                    {leaveType.allocated_leaves -
                                        leaveType.used_leaves}{" "}
                                    days
                                </Typography>
                            </Box>
                        </FlexBetween>
                    </Box>
                ))}

                <FlexCenter mt={4}>
                  <Link to={RouteList.leaveRequests}>
                      <Button>
                        See Leave Request History
                      </Button>
                  </Link>
                </FlexCenter>
        </>
    );
}

interface EmployeeLeaveTypesProps {
    leaveTypes: NewEmployeeLeaveType[];
}
