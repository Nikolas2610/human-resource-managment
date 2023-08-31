import { convertToDDMMYYYY } from "@/utils/helpers/functions";
import { Grid, Avatar, Typography, useTheme } from "@mui/material";

export default function DashboardEmployeeOnLeaveBox({
    name,
    type,
    start_date,
    end_date,
    image,
}: DashboardEmployeeOnLeaveBoxProps) {
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
                <Avatar
                    sx={{
                        bgcolor: "white",
                        width: 48,
                        height: 48,
                    }}
                >
                    {image ? image : name.charAt(0)}
                </Avatar>
                <Typography textAlign={"center"}>{name}</Typography>
            </Grid>

            <Grid
                item
                xs={4}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                <Typography>{`${convertToDDMMYYYY(
                    start_date
                )} - ${convertToDDMMYYYY(end_date)}`}</Typography>
            </Grid>
            <Grid
                item
                xs={4}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"end"}
            >
                <Typography>{type}</Typography>
            </Grid>
        </Grid>
    );
}

interface DashboardEmployeeOnLeaveBoxProps {
    name: string;
    type: string;
    start_date: string;
    end_date: string;
    image: string | null;
}
