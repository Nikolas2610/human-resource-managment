import { useState } from "react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Grid,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    useTheme,
    Box,
} from "@mui/material";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import { useNavigate } from "react-router-dom";
import RouteList from "@/routes/RouteList";
import { subscriptionPlans } from "../data/subscriptionPlans";

const PricingPage = () => {
    const [billing, setBilling] = useState("monthly");
    const theme = useTheme();
    const navigate = useNavigate();

    const handleBillingChange = (_event: any, newBilling: string) => {
        if (newBilling !== null) {
            setBilling(newBilling);
        }
    };

    const handleGetStarted = (packageTitle: string) => {
        navigate(RouteList.registerWithParams(packageTitle.toLocaleLowerCase(), billing));
    };

    return (
        <Box
            bgcolor={theme.palette.background.paper}
            height={"100vh"}
            display={"flex"}
            alignItems={"center"}
        >
            <Container maxWidth="md">
                <Typography
                    variant="h1"
                    align="center"
                    gutterBottom
                    color={"white"}
                >
                    Choose Your Plan
                </Typography>

                <FlexCenter my={4}>
                    <ToggleButtonGroup
                        value={billing}
                        exclusive
                        onChange={handleBillingChange}
                        aria-label="billing"
                        sx={{ justifyContent: "center", marginBottom: 2 }}
                    >
                        <ToggleButton value="monthly" aria-label="monthly">
                            Monthly
                        </ToggleButton>
                        <ToggleButton value="yearly" aria-label="yearly">
                            Yearly
                        </ToggleButton>
                    </ToggleButtonGroup>
                </FlexCenter>

                <Grid container spacing={3}>
                    {subscriptionPlans.map((pkg) => (
                        <Grid item xs={12} sm={4} key={pkg.title}>
                            <Card>
                                <CardHeader
                                    title={pkg.title}
                                    titleTypographyProps={{ align: "center" }}
                                    subheaderTypographyProps={{
                                        align: "center",
                                    }}
                                    subheader={
                                        billing === "yearly"
                                            ? `$${pkg.price.yearly} / year`
                                            : `$${pkg.price.monthly} / month`
                                    }
                                    sx={{
                                        background:
                                            "linear-gradient(60deg, #ab47bc, #8e24aa)",
                                        color: "white",
                                    }}
                                />
                                <CardContent>
                                    <Typography
                                        variant="h4"
                                        align="center"
                                        fontWeight={700}
                                        gutterBottom
                                    >
                                        Features
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        align="center"
                                        gutterBottom
                                    >
                                        {pkg.users}
                                    </Typography>
                                    <Button
                                        sx={{ mt: 2 }}
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleGetStarted(pkg.title)}
                                    >
                                        Get Started
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default PricingPage;
