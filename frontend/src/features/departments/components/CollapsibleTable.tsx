import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { UserRole } from "@/features/auth/enums/UserRole";
import UserAvatar from "@/components/ui/UserAvatar";

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
    price: number
) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
        price,
        history: [
            {
                date: "2020-01-05",
                customerId: "11091700",
                amount: 3,
            },
            {
                date: "2020-01-02",
                customerId: "Anonymous",
                amount: 1,
            },
        ],
    };
}

interface RowProps {
    employee: Employee;
}

const Row = ({ employee }: RowProps) => {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <UserAvatar 
                        name={employee.name}
                        image={employee.image}
                    />
                </TableCell>
                <TableCell align="right">{employee.name ?? null}</TableCell>
                <TableCell align="right">{employee.email}</TableCell>
                <TableCell align="right">{employee.role}</TableCell>
                <TableCell align="right">{employee.position}</TableCell>
                <TableCell align="right">{employee.salary}</TableCell>
                <TableCell align="right">{employee.address}</TableCell>
                <TableCell align="right">{employee.phone}</TableCell>
                <TableCell align="right">{employee.reports_to}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={12}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit >
                        <Box sx={{ margin: 1, width: '100%' }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                Leaves
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Leave Type</TableCell>
                                        <TableCell>Default Leaves</TableCell>
                                        <TableCell>
                                            Unavailable Leaves
                                        </TableCell>
                                        <TableCell>Used Leaves</TableCell>
                                        <TableCell>Remaining Leaves</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {employee.leaves.map((leave, index) => (
                                        <TableRow key={index}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {leave.type}
                                            </TableCell>
                                            <TableCell>
                                                {leave.allocated_leaves}
                                            </TableCell>
                                            <TableCell>
                                                {leave.unavailable_leaves}
                                            </TableCell>
                                            <TableCell>
                                                {leave.used_leaves}
                                            </TableCell>
                                            <TableCell>
                                                {leave.remaining_leaves}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export default function CollapsibleTable({ employees }: CollapsibleTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Image</TableCell>
                        <TableCell align="right">Name</TableCell>
                        <TableCell align="right">Email</TableCell>
                        <TableCell align="right">Role</TableCell>
                        <TableCell align="right">Position</TableCell>
                        <TableCell align="right">Salary</TableCell>
                        <TableCell align="right">Address</TableCell>
                        <TableCell align="right">Phone</TableCell>
                        <TableCell align="right">Reports To</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((employee) => (
                        <Row key={employee.id} employee={employee} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

interface CollapsibleTableProps {
    employees: Employee[];
}

interface Employee {
    id: number;
    name: string;
    image: string | null;
    email: string;
    address: string;
    role: UserRole;
    salary: number | null;
    phone: string;
    reports_to: string | null;
    position: string;
    leaves: Leaves[];
}

interface Leaves {
    allocated_leaves: number;
    used_leaves: number;
    remaining_leaves: number;
    unavailable_leaves: number;
    type: string;
}
