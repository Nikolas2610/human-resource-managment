import SwitchTwoValues from "@/components/ui/SwitchTwoValues";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import { Box, Typography, useTheme } from "@mui/material";

export default function RowIntegrationWrapper({
    value,
    setValue,
    children,
}: RowIntegrationWrapperProps) {
    const theme = useTheme();
    const integrationBoxStyle = {
        cursor: "pointer",
        transition: ".3s",
        "&:hover": {
            backgroundColor: theme.palette.primary.dark,
        },
    };

    return (
        <FlexBetween borderBottom={2} py={2} px={1} sx={integrationBoxStyle}>
            <Box>
                <Typography variant="h4">{children}</Typography>
            </Box>
            <SwitchTwoValues
                value={value || false}
                onChange={(value) => setValue(value)}
            />
        </FlexBetween>
    );
}

interface RowIntegrationWrapperProps {
    value: boolean;
    setValue: (value: boolean) => void;
    children: React.ReactNode;
}
