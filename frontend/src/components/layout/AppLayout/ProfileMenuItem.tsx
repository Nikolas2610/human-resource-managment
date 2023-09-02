import { Logout, PersonAdd } from "@mui/icons-material";
import Settings from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect } from "react";
import { Typography, useTheme } from "@mui/material";
import { apiService, useLogoutMutation } from "@/features/api/apiService";
import useToggleDashboardLoading from "@/hooks/useToggleDashboardLoading";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { getAvatarName } from "@/utils/helpers/functions";
import { Link, useNavigate } from "react-router-dom";
import RouteList from "@/routes/RouteList";
import PersonIcon from "@mui/icons-material/Person";

function ProfileMenuItem() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const theme = useTheme();
    const handleClose = () => {
        setAnchorEl(null);
    };
    const { user } = useSelector((state: RootState) => state.auth);
    const [logout, { isLoading, isSuccess, isError }] = useLogoutMutation();
    const dispatch = useDispatch();
    useToggleDashboardLoading(isLoading);
    const navigate = useNavigate();
    // !FIX ME: The snackbar stay on the DOM
    // useSuccessSnackbar({
    //     isSuccess,
    //     message: "Has been logout successfully",
    //     to: RouteList.login,
    // });

    useEffect(() => {
        if (isSuccess || isError) {
            // reset the API state here
            dispatch(apiService.util.resetApiState());
            navigate(RouteList.login);
        }
    }, [isSuccess, isError, dispatch]);

    const linkStyle = {
        display: "flex",
        alignItems: "center",
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    return (
        <React.Fragment>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>
                            {getAvatarName(
                                user?.first_name ?? "U",
                                user?.last_name ?? ""
                            )}
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        color: theme.palette.common.white,
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleClose}>
                    {user?.first_name + " " + user?.last_name}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <Link to={RouteList.profile} style={linkStyle}>
                        <ListItemIcon
                            sx={{ color: theme.palette.common.white }}
                        >
                            <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography>Profile</Typography>
                    </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link to={RouteList.createLeaveRequest} style={linkStyle}>
                        <ListItemIcon
                            sx={{ color: theme.palette.common.white }}
                        >
                            <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        <Typography>Post Leave Request</Typography>
                    </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon sx={{ color: theme.palette.common.white }}>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon sx={{ color: theme.palette.common.white }}>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}

export default ProfileMenuItem;
