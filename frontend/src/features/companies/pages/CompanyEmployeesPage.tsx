import { selectCompany } from "@/features/auth/authSlice";
import { useSelector } from "react-redux";
import { useGetEmployeesCompanyByDepartmentQuery } from "../companiesEndpoints";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Grid,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { SyntheticEvent } from "react";
import UserAvatar from "@/components/ui/UserAvatar";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";

export default function CompanyEmployeesPage() {
    const theme = useTheme();
    const companyId = useSelector(selectCompany);
    const {
        data: departments = [],
        isLoading,
        isError,
    } = useGetEmployeesCompanyByDepartmentQuery(companyId);
    const [expandedAccordions, setExpandedAccordions] = useState<number[]>([]);
    usePageTitle("Company Employees");

    useEffect(() => {
        if (departments.length > 0) {
            // Initialize all accordions to be open
            const initialExpanded = departments.map(
                (dept) => dept.department_id
            );
            setExpandedAccordions(initialExpanded);
        }
    }, [departments]);

    const handleAccordionChange =
        (departmentId: number) =>
        (_event: SyntheticEvent, isExpanded: boolean) => {
            setExpandedAccordions((prevExpanded) => {
                if (isExpanded) {
                    return [...prevExpanded, departmentId];
                } else {
                    return prevExpanded.filter((id) => id !== departmentId);
                }
            });
        };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Something went wrong...</div>;
    }

    return (
        <Stack>
            {departments.length > 0 &&
                departments.map((department) => (
                    <Accordion
                        key={department.department_id}
                        expanded={expandedAccordions.includes(
                            department.department_id
                        )}
                        onChange={handleAccordionChange(
                            department.department_id
                        )}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                        >
                            <Typography variant="h3">
                                {department.department_name}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container>
                                {department.employees.map((employee) => (
                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        key={employee.id}
                                        p={1}
                                    >
                                        <Box
                                            bgcolor={
                                                theme.palette.background.default
                                            }
                                            borderRadius={2}
                                            p={2}
                                            sx={{
                                                transition: ".3s",
                                                border: `1px solid transparent`,
                                                "&:hover": {
                                                    backgroundColor:
                                                        theme.palette.primary
                                                            .main,
                                                    border: `1px solid ${theme.palette.primary.light}`,
                                                },
                                            }}
                                        >
                                            <Box
                                                display={"flex"}
                                                gap={2}
                                                alignItems={"center"}
                                            >
                                                <UserAvatar
                                                    image={employee.image}
                                                    name={employee.name}
                                                />
                                                <Box mt={0.5}>
                                                    <Typography
                                                        variant="h3"
                                                        fontWeight={500}
                                                    >
                                                        {employee.name}
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        {employee.position}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Stack mt={2} px={1} spacing={0.5}>
                                                <Link
                                                    to={`mailto:${employee.email}`}
                                                    style={{ marginBottom: 8 }}
                                                >
                                                    <Box
                                                        display={"flex"}
                                                        gap={1}
                                                    >
                                                        <EmailIcon />
                                                        <Typography>
                                                            {employee.email}
                                                        </Typography>
                                                    </Box>
                                                </Link>
                                                <Link
                                                    to={`tel:${employee.phone}`}
                                                >
                                                    <Box
                                                        display={"flex"}
                                                        gap={1}
                                                    >
                                                        <LocalPhoneIcon />
                                                        <Typography>
                                                            {employee.phone}
                                                        </Typography>
                                                    </Box>
                                                </Link>

                                                <FlexBetween
                                                    sx={{
                                                        display: {
                                                            xs: "block",
                                                            lg: "flex",
                                                        },
                                                    }}
                                                >
                                                    <Typography>
                                                        Work to company:{" "}
                                                        {employee.work_duration}
                                                    </Typography>
                                                    <Box
                                                        display={"flex"}
                                                        gap={1}
                                                        alignItems={"center"}
                                                    >
                                                        <Typography>
                                                            Reports To:
                                                        </Typography>
                                                        {employee.reports_to && (
                                                            <UserAvatar
                                                                image={
                                                                    employee.reports_to_image
                                                                }
                                                                name={
                                                                    employee.reports_to
                                                                }
                                                            />
                                                        )}

                                                        <Typography>
                                                            {
                                                                employee.reports_to
                                                            }
                                                        </Typography>
                                                    </Box>
                                                </FlexBetween>
                                            </Stack>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
        </Stack>
    );
}
