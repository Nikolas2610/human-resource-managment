import { selectCompany, selectUserID } from "@/features/auth/authSlice";
import {
    useGetEmployeeDocumentsQuery,
    useGetEmployeeQuery,
} from "@/features/employees/employeesEndpoints";
import {
    Avatar,
    Box,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import SignpostIcon from "@mui/icons-material/Signpost";
import ProfileData from "../components/ProfileData";
import EmployeeDocuments from "../components/EmployeeDocuments";
import EmployeeLeaveTypes from "../components/EmployeeLeaveTypes";
import BoxDetailsWrapper from "../components/BoxDetailsWrapper";

export default function ProfilePage() {
    const theme = useTheme();
    const employeeId = useSelector(selectUserID);
    const companyId = useSelector(selectCompany);
    const [activeItem, setActiveItem] = useState<
        "profile" | "documents" | "leaves"
    >("profile");
    const {
        data: employee = null,
        isLoading,
        isError,
    } = useGetEmployeeQuery({ companyId, employeeId });
    const { data: employeeDocuments = [] } = useGetEmployeeDocumentsQuery({
        companyId,
        employeeId,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Fetch error</div>;
    }

    return (
        <Stack>
            <Box
                position={"relative"}
                height={275}
                display={"flex"}
                width={"100%"}
                alignItems={"end"}
            >
                <Stack
                    borderRadius={2}
                    height={200}
                    bgcolor={theme.palette.primary.main}
                    width={"100%"}
                    justifyContent={"end"}
                    display={"flex"}
                    py={2}
                    px={8}
                    spacing={0.5}
                >
                    <Box display={"flex"} justifyContent={"space-between"}>
                        <Stack spacing={0.5}>
                            <Typography variant="h2" fontWeight={600}>
                                {employee?.first_name} {employee?.last_name}
                            </Typography>
                            <Typography variant="h4">
                                {employee?.position.title}
                            </Typography>
                            <Typography
                                variant="h5"
                                color={theme.palette.grey[400]}
                            >
                                {employee?.department.name}
                            </Typography>
                        </Stack>
                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"space-between"}
                            alignItems={"end"}
                        >
                            <Box display={"flex"} gap={2}>
                                <Tooltip title="Profile">
                                    <IconButton
                                        sx={{
                                            backgroundColor:
                                                activeItem === "profile"
                                                    ? theme.palette.primary.dark
                                                    : "transparent",
                                            transition: ".5s",
                                            borderRadius: 2,
                                            "&:hover": {
                                                backgroundColor:
                                                    activeItem === "profile"
                                                        ? theme.palette.primary
                                                              .dark
                                                        : theme.palette.primary
                                                              .light,
                                            },
                                        }}
                                        onClick={() => setActiveItem("profile")}
                                    >
                                        <PersonIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Documents">
                                    <IconButton
                                        sx={{
                                            backgroundColor:
                                                activeItem === "documents"
                                                    ? theme.palette.primary.dark
                                                    : "transparent",
                                            borderRadius: 2,
                                            transition: ".5s",
                                            "&:hover": {
                                                backgroundColor:
                                                    activeItem === "documents"
                                                        ? theme.palette.primary
                                                              .dark
                                                        : theme.palette.primary
                                                              .light,
                                            },
                                        }}
                                        onClick={() =>
                                            setActiveItem("documents")
                                        }
                                    >
                                        <DescriptionIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Leaves">
                                    <IconButton
                                        sx={{
                                            backgroundColor:
                                                activeItem === "leaves"
                                                    ? theme.palette.primary.dark
                                                    : "transparent",
                                            borderRadius: 2,
                                            transition: ".5s",
                                            "&:hover": {
                                                backgroundColor:
                                                    activeItem === "leaves"
                                                        ? theme.palette.primary
                                                              .dark
                                                        : theme.palette.primary
                                                              .light,
                                            },
                                        }}
                                        onClick={() => setActiveItem("leaves")}
                                    >
                                        <SignpostIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                </Stack>
                <Avatar
                    sx={{
                        position: "absolute",
                        left: "50px",
                        top: "0",
                        height: 150,
                        width: 150,
                        border: "2px solid white",
                        padding: 2,
                        backgroundColor: "white",
                        fontSize: "4rem",
                    }}
                    src={employee?.image}
                >
                    N
                </Avatar>
            </Box>
            <BoxDetailsWrapper>
                {activeItem === "profile" && employee && (
                    <ProfileData employee={employee} />
                )}
                {activeItem === "documents" && (
                    <EmployeeDocuments documents={employeeDocuments} />
                )}
                {activeItem === "leaves" && employee?.leave_types && (
                    <EmployeeLeaveTypes leaveTypes={employee?.leave_types} />
                )}
            </BoxDetailsWrapper>
        </Stack>
    );
}
