import SwitchTwoValues from "@/components/ui/SwitchTwoValues";
import usePageTitle from "@/hooks/usePageTitle";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { useState } from "react";

export default function Integrations() {
    const [value, setValue] = useState(false);
    const theme = useTheme();
    usePageTitle("Integrations");
    
    return (
        <>
            <Typography variant={"h2"} fontWeight={500}>
                Integrations
            </Typography>
            <Grid container gap={4}>
                <Grid item xs={12} md={6} lg={4}>
                    <Box
                        mt={5}
                        bgcolor={theme.palette.warning.dark}
                        height={100}
                        p={2}
                        position={"relative"}
                        borderRadius={4}
                    >
                        <Typography variant="h3">HR Approved</Typography>
                        <Box position={"absolute"} bottom={20} right={20}>
                            <SwitchTwoValues
                                value={value}
                                onChange={(value) => setValue(value)}
                            />
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Box
                        mt={5}
                        bgcolor={theme.palette.error.dark}
                        p={2}
                        height={100}
                        position={"relative"}
                        borderRadius={4}
                    >
                        <Typography variant="h3">Manager Approved</Typography>
                        <Box position={"absolute"} bottom={20} right={20}>
                            <SwitchTwoValues
                                value={value}
                                onChange={(value) => setValue(value)}
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
