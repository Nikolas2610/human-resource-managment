import { Box, Button, Typography, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";

export default function HeaderPageAddFeature({
    to,
    headerTitle,
    buttonTitle,
}: HeaderPageAddFeatureProps) {
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
            <Typography
                variant="h3"
                fontWeight={700}
                color={theme.palette.primary.contrastText}
            >
                {headerTitle}
            </Typography>
            {to && (
                <Link to={to}>
                    <Button
                        variant={"contained"}
                        size="large"
                        startIcon={<AddIcon />}
                    >
                        {buttonTitle}
                    </Button>
                </Link>
            )}
        </Box>
    );
}

interface HeaderPageAddFeatureProps {
    to?: string;
    buttonTitle?: string;
    headerTitle: string;
}
