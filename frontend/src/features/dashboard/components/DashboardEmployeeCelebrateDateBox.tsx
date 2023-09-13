import UserAvatar from "@/components/ui/UserAvatar";
import { convertToDDMMYYYY } from "@/utils/helpers/functions";
import { Grid, Typography, useTheme } from "@mui/material";

export default function DashboardEmployeeCelebrateDateBox({
    employee_name,
    employee_image,
    next_birthday,
    days_until,
}: DashboardEmployeeCelebrateDateBoxProps) {
    const theme = useTheme();
    return (
        <Grid
            container
            bgcolor={theme.palette.primary.main}
            p={2}
            my={0.3}
            borderRadius={1}
        >
            <Grid item xs={4} display={"flex"} alignItems={"center"} gap={2}>
                <UserAvatar name={employee_name} image={employee_image} />
                <Typography textAlign={"center"}>{employee_name}</Typography>
            </Grid>

            <Grid
                item
                xs={4}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                <Typography>
                    in {days_until === 1 ? "1 day" : `${days_until} days`}
                </Typography>
            </Grid>
            <Grid
                item
                xs={4}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"end"}
            >
                <Typography>{convertToDDMMYYYY(next_birthday)}</Typography>
            </Grid>
        </Grid>
    );
}

interface DashboardEmployeeCelebrateDateBoxProps {
    employee_name: string;
    days_until: number;
    next_birthday: string;
    employee_image: string | null;
}
