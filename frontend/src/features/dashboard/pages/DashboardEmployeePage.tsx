import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import { selectCompany } from "@/features/auth/authSlice";
import { useGetEmployeesAnniversariesQuery } from "@/features/employees/employeesEndpoints";
import { useGetEmployeeLeaveRequestOnLeaveQuery } from "@/features/leave-requests/leaveRequestsEndpoints";
import { useGetEmployeeLeavesQuery } from "@/features/leave-types/leaveTypesEndpoints";
import RouteList from "@/routes/RouteList";
import { Box, Button, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DashboardEmployeeAnniversaryBox from "../components/DashboardEmployeeAnniversaryBox";
import DashboardEmployeeOnLeaveBox from "../components/DashboardEmployeeOnLeaveBox";
import ScrollBoxWrapper from "../components/ScrollBoxWrapper";

export default function DashboardEmployeePage() {
    const theme = useTheme();
    const companyId = useSelector(selectCompany);
    // Queries
    const { data: employeeLeaves = [], isLoading: isDataLoading } =
        useGetEmployeeLeavesQuery(companyId);
    const {
        data: leaveRequestsOnLeave = [],
        isLoading: isLeaveRequestsLoading,
    } = useGetEmployeeLeaveRequestOnLeaveQuery(companyId);
    const {
        data: employeeAnniversaries = [],
        isLoading: isEmployeeAnniversariesLoading,
    } = useGetEmployeesAnniversariesQuery(companyId);

    if (
        isDataLoading ||
        isLeaveRequestsLoading ||
        isEmployeeAnniversariesLoading
    ) {
        return "Loading...";
    }
    return (
        <>
            <Box>
                <FlexBetween>
                    <Typography mb={3} variant="h3">
                        {employeeLeaves.filter(
                            (leave) => leave.visible_to_employees
                        ).length > 0 && "Leaves"}
                    </Typography>
                    <Link to={RouteList.createLeaveRequest}>
                        <Button variant="contained">Request a Leave</Button>
                    </Link>
                </FlexBetween>
                <Grid container gap={4}>
                    {employeeLeaves.length > 0 &&
                        employeeLeaves
                            .filter((leave) => leave.visible_to_employees)
                            .map((leave) => (
                                <Grid item key={leave.id} xs={12} md={4}>
                                    <Stack
                                        boxShadow={10}
                                        p={2}
                                        spacing={1}
                                        borderRadius={4}
                                        bgcolor={theme.palette.primary.main}
                                    >
                                        <Typography
                                            variant="h3"
                                            textAlign={"center"}
                                            fontWeight={700}
                                            sx={{
                                                textDecoration: "underline",
                                                textUnderlineOffset: 8,
                                            }}
                                            pb={3}
                                        >
                                            {leave.type}
                                        </Typography>
                                        <Typography variant="h4">
                                            Default leaves:{" "}
                                            {leave.allocated_leaves}
                                        </Typography>
                                        <Typography variant="h4">
                                            Used leaves: {leave.used_leaves}
                                        </Typography>
                                        <Typography variant="h4">
                                            Available leaves:{" "}
                                            {leave.allocated_leaves -
                                                leave.used_leaves}
                                        </Typography>
                                    </Stack>
                                </Grid>
                            ))}
                </Grid>
            </Box>
            {leaveRequestsOnLeave?.length > 0 && (
                <Grid container spacing={4} mt={5}>
                    <Grid item xs={12} lg={6}>
                        <Box>
                            <Typography mb={3} variant="h3">
                                Employees On Leave
                            </Typography>
                        </Box>
                        <ScrollBoxWrapper>
                            {leaveRequestsOnLeave.map((leave) => (
                                <DashboardEmployeeOnLeaveBox
                                    name={leave.employee_name}
                                    key={leave.id}
                                    start_date={leave.start_date}
                                    end_date={leave.end_date}
                                    image={leave.employee_image ?? null}
                                    type={leave.leave_type_name}
                                />
                            ))}
                        </ScrollBoxWrapper>
                    </Grid>
                    {employeeAnniversaries.length > 0 && (
                        <Grid item xs={12} lg={6}>
                            <Typography mb={3} variant="h3">
                                Anniversaries
                            </Typography>
                            <ScrollBoxWrapper>
                                {employeeAnniversaries.map(
                                    (
                                        {
                                            name,
                                            years_worked,
                                            next_anniversary,
                                            image,
                                        },
                                        index
                                    ) => (
                                        <DashboardEmployeeAnniversaryBox
                                            name={name}
                                            date={next_anniversary}
                                            year={years_worked}
                                            key={index}
                                            image={image}
                                        />
                                    )
                                )}
                            </ScrollBoxWrapper>
                        </Grid>
                    )}
                    <Grid item xs={12} lg={6}>
                        <Typography mb={3} variant="h3">
                            Birthdays
                        </Typography>
                    </Grid>
                </Grid>
            )}
        </>
    );
}