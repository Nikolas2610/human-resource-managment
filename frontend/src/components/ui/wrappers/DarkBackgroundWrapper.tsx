import { Stack, useTheme } from "@mui/material";

export default function DarkBackgroundWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const theme = useTheme();
    return (
        <Stack
            bgcolor={theme.palette.background.default}
            height={{ xs: "100%", md: "100vh" }}
        >
            {children}
        </Stack>
    );
}
