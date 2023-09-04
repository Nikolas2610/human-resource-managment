import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import { Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function RowSettingsWrapper({
    children,
    to,
}: RowSettingsWrapperProps) {
    const theme = useTheme();
    const settingsBoxStyle = {
        cursor: "pointer",
        transition: ".3s",
        "&:hover": {
            backgroundColor: theme.palette.primary.dark,
        },
    };
    return (
        <Link to={to}>
            <FlexBetween borderBottom={2} py={2} px={1} sx={settingsBoxStyle}>
                <Typography variant="h4">{children}</Typography>
                <PlayArrowIcon />
            </FlexBetween>
        </Link>
    );
}

interface RowSettingsWrapperProps {
    to: string;
    children: React.ReactNode;
}
