import { Box, useTheme } from "@mui/material";
import { ReactNode } from "react";

export default function ScrollBoxWrapper({ children }: ScrollBoxWrapperProps) {
    const theme = useTheme();

    return (
        <Box
            maxHeight={400}
            overflow={"auto"}
            sx={{
                "&::-webkit-scrollbar": {
                    width: "12px",
                },
                "&::-webkit-scrollbar-track": {
                    boxShadow: `inset 0 0 1px ${theme.palette.background.paper}`,
                    borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: `${theme.palette.primary.main}`,
                    border: `3.5px solid transparent`,
                    borderRadius: "10px",
                    outline: `3px solid transparent`,
                    backgroundClip: "content-box", // Makes the thumb thinner by adding padding (this is effectively a visual margin)
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: `${theme.palette.background.paper}`,
                },
            }}
        >
            {children}
        </Box>
    );
}

interface ScrollBoxWrapperProps {
    children: ReactNode;
}
