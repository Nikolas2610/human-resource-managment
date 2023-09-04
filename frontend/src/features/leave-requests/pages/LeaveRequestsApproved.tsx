import {
    Alert,
    Box,
    Tab,
    Autocomplete,
    TextField,
    IconButton,
    Fade,
    Tooltip,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCompany, selectUserRole } from "@/features/auth/authSlice";
import { useGetManagerLeaveRequestQuery } from "../leaveRequestsEndpoints";
import { LeaveRequest } from "@/types/leave-requests/LeaveRequest.type";
import ManagerLeaveRequestsAccordion from "../components/ManagerLeaveRequestsAccordion";
import { LeaveRequestApprovalStatus } from "../enums/LeaveRequestApprovalStatus.enum";
import { UserRole } from "@/features/auth/enums/UserRole";
import { useGetCompanyQuery } from "@/features/companies/companiesEndpoints";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { LeaveRequestStatus } from "../enums/LeaveRequestStatus.enum";

export default function LeaveRequestsApproved() {
    const [value, setValue] = useState("1");
    const companyId = useSelector(selectCompany);
    const userRole = useSelector(selectUserRole);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
        null
    );
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(
        null
    );
    const [selectedStatus, setSelectedStatus] =
        useState<LeaveRequestStatus | null>(null);
    const [isFilterTab, setIsFilterTab] = useState<boolean>(false);
    const { data: leaveRequests = [], isLoading: isDataLoading } =
        useGetManagerLeaveRequestQuery(companyId);
    const { data: company } = useGetCompanyQuery(companyId);
    const [pendingLeaveRequests, setPendingLeaveRequests] = useState<
        LeaveRequest[]
    >([]);
    const [approvalLeaveRequests, setApprovalLeaveRequests] = useState<
        LeaveRequest[]
    >([]);
    const [rejectedLeaveRequests, setRejectedLeaveRequests] = useState<
        LeaveRequest[]
    >([]);

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        // Reset filters when tab changes
        setSelectedDepartment(null);
        setSelectedEmployee(null);
    };

    useEffect(() => {
        const approvalField =
            userRole === UserRole.HR ? "hr_approved" : "manager_approved";

        if (leaveRequests.length > 0) {
            setPendingLeaveRequests(
                leaveRequests.filter(
                    (leave) =>
                        leave[approvalField] ===
                        LeaveRequestApprovalStatus.PENDING
                )
            );
            setApprovalLeaveRequests(
                leaveRequests.filter(
                    (leave) =>
                        leave[approvalField] ===
                        LeaveRequestApprovalStatus.APPROVED
                )
            );
            setRejectedLeaveRequests(
                leaveRequests.filter(
                    (leave) =>
                        leave[approvalField] ===
                        LeaveRequestApprovalStatus.REJECTED
                )
            );
        }
    }, [leaveRequests]);

    if (isDataLoading) {
        return "Loading...";
    }

    // Generate unique list of department names and employee names from leaveRequests
    const departmentNames = Array.from(
        new Set(leaveRequests.map((leave) => leave.department.name))
    );
    const employeeNames = Array.from(
        new Set(leaveRequests.map((leave) => leave.employee_name))
    );

    // Function to filter leave requests based on selected department and employee
    const filterLeaveRequests = (
        leaveRequests: LeaveRequest[]
    ): LeaveRequest[] => {
        return leaveRequests.filter((leave) => {
            return (
                (!selectedDepartment ||
                    leave.department.name === selectedDepartment) &&
                (!selectedEmployee ||
                    leave.employee_name === selectedEmployee) &&
                (!selectedStatus || leave.status === selectedStatus)
            );
        });
    };

    return (
        <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                        centered
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                    >
                        <Tab label="Pending" value="1" />
                        <Tab label="Approved" value="2" />
                        <Tab label="Rejected" value="3" />
                        <Tab label="All" value="4" />
                    </TabList>
                </Box>

                <Box
                    display={"flex"}
                    justifyContent={"end"}
                    alignItems={"center"}
                    mt={4}
                    gap={2}
                >
                    <Fade in={isFilterTab}>
                        <Box width={"100%"} display={"flex"} gap={2}>
                            <Autocomplete
                                options={departmentNames}
                                value={selectedDepartment}
                                onChange={(_, newValue: string | null) =>
                                    setSelectedDepartment(
                                        newValue as string | null
                                    )
                                }
                                fullWidth
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label="Department"
                                    />
                                )}
                            />
                            <Autocomplete
                                fullWidth
                                options={employeeNames}
                                value={selectedEmployee}
                                onChange={(_, newValue: string | null) =>
                                    setSelectedEmployee(
                                        newValue as string | null
                                    )
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="Employee" />
                                )}
                            />
                            <Autocomplete
                                fullWidth
                                options={Object.values(
                                    LeaveRequestStatus
                                ).filter((status) => status !== "done")}
                                getOptionLabel={(option) =>
                                    option.charAt(0).toUpperCase() +
                                    option.slice(1)
                                }
                                value={selectedStatus}
                                onChange={(_, newValue: string | null) =>
                                    setSelectedStatus(
                                        newValue as LeaveRequestStatus | null
                                    )
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="Status" />
                                )}
                            />
                        </Box>
                    </Fade>
                    <Tooltip title={"Filters"} placement="top">
                        <IconButton
                            onClick={() => setIsFilterTab((prev) => !prev)}
                        >
                            {isFilterTab ? (
                                <FilterAltIcon />
                            ) : (
                                <FilterAltOffIcon />
                            )}
                        </IconButton>
                    </Tooltip>
                </Box>
                <TabPanel value="1">
                    {pendingLeaveRequests.length > 0 && company ? (
                        filterLeaveRequests(pendingLeaveRequests).map(
                            (leave) => (
                                <ManagerLeaveRequestsAccordion
                                    leave={leave}
                                    key={leave.id}
                                    company={company}
                                />
                            )
                        )
                    ) : (
                        <Alert severity="info">No pending leave requests</Alert>
                    )}
                </TabPanel>
                <TabPanel value="2">
                    {approvalLeaveRequests.length > 0 && company ? (
                        filterLeaveRequests(approvalLeaveRequests).map(
                            (leave) => (
                                <ManagerLeaveRequestsAccordion
                                    leave={leave}
                                    key={leave.id}
                                    company={company}
                                />
                            )
                        )
                    ) : (
                        <Alert severity="info">
                            No approval leave requests
                        </Alert>
                    )}
                </TabPanel>
                <TabPanel value="3">
                    {rejectedLeaveRequests.length > 0 && company ? (
                        filterLeaveRequests(rejectedLeaveRequests).map(
                            (leave) => (
                                <ManagerLeaveRequestsAccordion
                                    leave={leave}
                                    key={leave.id}
                                    company={company}
                                />
                            )
                        )
                    ) : (
                        <Alert severity="info">
                            No rejected leave requests
                        </Alert>
                    )}
                </TabPanel>
                <TabPanel value="4">
                    {leaveRequests.length > 0 && company ? (
                        filterLeaveRequests(leaveRequests).map((leave) => (
                            <ManagerLeaveRequestsAccordion
                                leave={leave}
                                key={leave.id}
                                company={company}
                            />
                        ))
                    ) : (
                        <Alert severity="info">
                            No leave requests
                        </Alert>
                    )}
                </TabPanel>
            </TabContext>
        </Box>
    );
}
