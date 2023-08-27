import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import { Box, Grid, Typography } from "@mui/material";

export default function LeaveRequestDetails({
    fieldName,
    firstElement = false,
    children,
}: LeaveRequestDetailsProps) {
    return (
        <Box borderBottom={1} px={1} py={{ xs: 2, sm: 1 }} borderTop={firstElement ? 1 : 0}>
            <Grid container spacing={{ xs: 1, sm: 2 }} alignItems={'center'}>
                <Grid item xs={12} sm={3}>
                    <FlexBetween>
                        <Typography fontWeight={700}>{fieldName}</Typography>
                        <Typography
                            fontWeight={700}
                            sx={{
                                display: {
                                    xs: "none", // will not display on xs
                                    sm: "block", // will display from sm upwards
                                },
                            }}
                        >
                            :
                        </Typography>
                    </FlexBetween>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={9}
                    sx={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                    }}
                >
                    {children}
                </Grid>
            </Grid>
        </Box>
    );
}

interface LeaveRequestDetailsProps {
    firstElement?: boolean;
    fieldName: string;
    children: React.ReactNode;
}
