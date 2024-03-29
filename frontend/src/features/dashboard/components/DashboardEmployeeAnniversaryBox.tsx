import UserAvatar from "@/components/ui/UserAvatar";
import { convertToDDMMYYYY } from "@/utils/helpers/functions";
import { Grid, Typography, useTheme } from "@mui/material";

export default function DashboardEmployeeAnniversaryBox({
    name,
    year,
    date,
    image
}: DashboardEmployeeAnniversaryBoxProps) {
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
                <UserAvatar 
                    name={name} 
                    image={image}   
                />
                <Typography textAlign={"center"}>{name}</Typography>
            </Grid>

            <Grid
                item
                xs={4}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                <Typography>{year + 1} year</Typography>
            </Grid>
            <Grid
                item
                xs={4}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"end"}
            >
                <Typography>{convertToDDMMYYYY(date)}</Typography>
            </Grid>
        </Grid>
    );
}

interface DashboardEmployeeAnniversaryBoxProps {
    name: string;
    year: number;
    date: string;
    image: string | null;
}
