import { Box, Button, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";


export default function HeaderPageBackFeature({
    to,
    headerTitle,
    buttonTitle,
}: HeaderPageBackFeatureProps) {
    const theme = useTheme();

    return (
        <Box
            p={3}
            borderRadius={4}
            boxShadow={4}
            bgcolor={theme.palette.background.paper}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
        >
            <Typography variant="h3" fontWeight={700}>
                {headerTitle}
            </Typography>
            <Link to={to}>
                <Button
                    variant={"contained"}
                    size="large"
                    startIcon={<KeyboardReturnIcon />}
                >
                    {buttonTitle}
                </Button>
            </Link>
        </Box>
    );
}

interface HeaderPageBackFeatureProps {
    to: string;
    buttonTitle: string;
    headerTitle: string;
}
