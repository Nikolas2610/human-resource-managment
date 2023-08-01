import { Box, useTheme } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link, useLocation } from "react-router-dom";

interface MenuLinkProps {
    to: string;
    primary: string;
    Icon: React.ElementType;
}

const MenuLink: React.FC<MenuLinkProps> = ({ to, primary, Icon }) => {
    const theme = useTheme();
    const location = useLocation();
    const isSamePath = location.pathname.split("/")[1] === to.split("/")[1];

    return (
        <Box
            sx={{
                color: isSamePath
                    ? theme.palette.primary.contrastText
                    : theme.palette.grey[500],
                "&:hover": {
                    color: isSamePath
                        ? theme.palette.primary.contrastText
                        : theme.palette.primary.contrastText,
                },
            }}
        >
            <Link
                to={to}
                style={{
                    textDecoration: "none",
                    color: isSamePath
                        ? theme.palette.primary.contrastText
                        : theme.palette.grey[500],
                }}
            >
                <ListItemButton
                    sx={{
                        background: isSamePath
                            ? theme.palette.primary.main
                            : "transparent",
                        "&:hover": {
                            background: isSamePath
                                ? theme.palette.primary.main
                                : theme.palette.primary.dark,
                            color: isSamePath
                                ? theme.palette.primary.contrastText
                                : theme.palette.primary.contrastText,
                            // Add this
                            "& .MuiListItemIcon-root": {
                                color: "white",
                            },
                        },
                    }}
                >
                    <ListItemIcon
                        sx={{
                            color: isSamePath
                                ? theme.palette.primary.contrastText
                                : theme.palette.grey[500],
                        }}
                        className="MuiListItemIcon-root" // Add this
                    >
                        <Icon />
                    </ListItemIcon>
                    <ListItemText primary={primary} />
                </ListItemButton>
            </Link>
        </Box>
    );
};

export default MenuLink;
