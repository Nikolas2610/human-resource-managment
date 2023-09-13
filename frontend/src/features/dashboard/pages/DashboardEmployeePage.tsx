import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import { selectCompany } from "@/features/auth/authSlice";
import { useGetEmployeeLeavesQuery } from "@/features/leave-types/leaveTypesEndpoints";
import RouteList from "@/routes/RouteList";
import { Box, Button, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DashboardEmployeeAnniversaryBox from "../components/DashboardEmployeeAnniversaryBox";
import DashboardEmployeeOnLeaveBox from "../components/DashboardEmployeeOnLeaveBox";
import ScrollBoxWrapper from "../components/ScrollBoxWrapper";
import { useGetEmployeeDashboardDataQuery } from "../dashboardEndpoints";
import DashboardEmployeeCelebrateDateBox from "../components/DashboardEmployeeCelebrateDateBox";

export default function DashboardEmployeePage() {
    const theme = useTheme();
    const companyId = useSelector(selectCompany);
    // Queries
    const { data: employeeLeaves = [], isLoading: isDataLoading } =
        useGetEmployeeLeavesQuery(companyId);

    const { data: dashboardData, isLoading: isDashboardDataLoading } =
        useGetEmployeeDashboardDataQuery(companyId);

    if (isDataLoading || isDashboardDataLoading) {
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
                                        borderRadius={1}
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
            <Grid container spacing={4} mt={5}>
                {dashboardData?.leaveRequests &&
                    dashboardData?.leaveRequests.length > 0 && (
                        <Grid item xs={12} lg={6}>
                            <Box>
                                <Typography mb={3} variant="h3">
                                    Employees On Leave
                                </Typography>
                            </Box>
                            <ScrollBoxWrapper>
                                {dashboardData?.leaveRequests.map((leave) => (
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
                    )}

                {dashboardData?.celebrate_anniversaries &&
                    dashboardData?.anniversaries &&
                    dashboardData?.anniversaries.length > 0 && (
                        <Grid item xs={12} lg={6}>
                            <Typography mb={3} variant="h3">
                                Anniversaries
                            </Typography>
                            <ScrollBoxWrapper>
                                {dashboardData?.anniversaries.map(
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
                {dashboardData?.celebrate_birthdays &&
                    dashboardData?.nextBirthdays &&
                    dashboardData?.nextBirthdays.length > 0 && (
                        <Grid item xs={12} lg={6}>
                            <Typography mb={3} variant="h3">
                                Upcoming Birthdays
                            </Typography>
                            <ScrollBoxWrapper>
                                {dashboardData?.nextBirthdays.map(
                                    (employee) => (
                                        <DashboardEmployeeCelebrateDateBox
                                            employee_name={
                                                employee.employee_name
                                            }
                                            days_until={employee.days_until}
                                            next_birthday={
                                                employee.next_birthday
                                            }
                                            key={employee.employee_id}
                                            employee_image={
                                                employee.employee_image ?? null
                                            }
                                        />
                                    )
                                )}
                            </ScrollBoxWrapper>
                        </Grid>
                    )}
                {dashboardData?.celebrate_name_days &&
                    dashboardData?.nextNameDays &&
                    dashboardData?.nextNameDays.length > 0 && (
                        <Grid item xs={12} lg={6}>
                            <Typography mb={3} variant="h3">
                                Upcoming Name Days
                            </Typography>
                            <ScrollBoxWrapper>
                                {dashboardData?.nextNameDays.map((employee) => (
                                    <DashboardEmployeeCelebrateDateBox
                                        employee_name={employee.employee_name}
                                        days_until={employee.days_until}
                                        next_birthday={employee.next_name_day}
                                        key={employee.employee_id}
                                        employee_image={
                                            employee.employee_image ?? null
                                        }
                                    />
                                ))}
                            </ScrollBoxWrapper>
                        </Grid>
                    )}
            </Grid>
        </>
    );
}
