import HeaderPageAddFeature from "@/components/ui/HeaderPageAddFeature";
import usePageTitle from "@/hooks/usePageTitle";
import RouteList from "@/routes/RouteList";
import { useGetEmployeeLeaveRequestQuery } from "../leaveRequestsEndpoints";
import { useSelector } from "react-redux";
import { selectCompany } from "@/features/auth/authSlice";
import { Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    convertToDDMMYYYY,
    formattedDateFrontend,
    getManagerStatus,
} from "@/utils/helpers/functions";
import LeaveRequestStatusChip from "../components/LeaveRequestStatusChip";
import LeaveRequestDetails from "../components/LeaveRequestDetails";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import { useEffect, useState } from "react";
import { LeaveRequest } from "@/types/leave-requests/LeaveRequest.type";
import { useGetCompanyQuery } from "@/features/companies/companiesEndpoints";

export default function LeaveRequestsPage() {
    const companyId = useSelector(selectCompany);
    const { data: leaveRequests = [], isLoading: isLeaveRequestsLoading } =
        useGetEmployeeLeaveRequestQuery(companyId);
    const { data: company, isLoading: isCompanyLoading } =
        useGetCompanyQuery(companyId);
    const [selectedYear, setSelectedYear] = useState<number | null>(
        new Date().getFullYear()
    );
    const [filteredLeaveRequests, setFilteredLeaveRequests] =
        useState(leaveRequests);

    // Custom Hooks
    usePageTitle("Leave Requests");

    useEffect(() => {
        if (leaveRequests.length > 0) {
            const filtered = selectedYear
                ? leaveRequests.filter(
                      (leave) =>
                          new Date(leave.created_at).getFullYear() ===
                          selectedYear
                  )
                : leaveRequests;

            setFilteredLeaveRequests(filtered);
        }
    }, [selectedYear, leaveRequests]);

    const uniqueYears = Array.from(
        new Set(
            leaveRequests.map((leave: LeaveRequest) =>
                new Date(leave.created_at).getFullYear()
            )
        )
    );

    if (isLeaveRequestsLoading) {
        return <>Loading...</>;
    }

    return (
        <>
            <HeaderPageAddFeature
                headerTitle="Leave Requests"
                buttonTitle="Request a leave"
                to={RouteList.createLeaveRequest}
            />
            {filteredLeaveRequests.length > 0 && (
                <>
                    <Box display={"flex"} justifyContent={"end"} mt={4}>
                        <FormControl variant="outlined">
                            <InputLabel id="year-label">
                                Filter by Year
                            </InputLabel>
                            <Select
                                labelId="year-label"
                                id="year-select"
                                value={selectedYear || ""}
                                onChange={(e) =>
                                    setSelectedYear(
                                        e.target.value
                                            ? parseInt(e.target.value as string)
                                            : null
                                    )
                                }
                                label="Filter by Year"
                                sx={{ width: "200px" }}
                            >
                                <MenuItem value="">
                                    <em>All Years</em>
                                </MenuItem>
                                {uniqueYears.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box mt={4}>
                        {filteredLeaveRequests.map((leave) => (
                            <Accordion key={leave.id}>
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
                                        <Typography variant="h4">
                                            Days Requested:{" "}
                                            {leave.days_requested}
                                        </Typography>
                                        <LeaveRequestStatusChip
                                            status={leave.status}
                                        />
                                    </FlexBetween>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <LeaveRequestDetails
                                        fieldName="Leave Type"
                                        firstElement
                                    >
                                        {leave.leave_type_name}
                                    </LeaveRequestDetails>
                                    <LeaveRequestDetails fieldName="Start Date">
                                        {convertToDDMMYYYY(leave.start_date)}
                                    </LeaveRequestDetails>
                                    <LeaveRequestDetails fieldName="End Date">
                                        {convertToDDMMYYYY(leave.end_date)}
                                    </LeaveRequestDetails>
                                    {company &&
                                        company.require_manager_approval && (
                                            <LeaveRequestDetails fieldName="Manager Approved">
                                                <LeaveRequestStatusChip
                                                    status={getManagerStatus(
                                                        leave.manager_approved
                                                    )}
                                                />
                                            </LeaveRequestDetails>
                                        )}
                                    {company && company.require_hr_approval && (
                                        <LeaveRequestDetails fieldName="HR Approved">
                                            <LeaveRequestStatusChip
                                                status={getManagerStatus(
                                                    leave.hr_approved
                                                )}
                                            />
                                        </LeaveRequestDetails>
                                    )}
                                    <LeaveRequestDetails fieldName="Reason">
                                        {leave.reason}
                                    </LeaveRequestDetails>
                                    <LeaveRequestDetails fieldName="Date Leave Request">
                                        {formattedDateFrontend(
                                            leave.created_at
                                        )}
                                    </LeaveRequestDetails>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                </>
            )}
        </>
    );
}
