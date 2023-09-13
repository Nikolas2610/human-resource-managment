import { IconButton, useTheme } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

interface SocialMediaIconProps {
    link: string | null;
    IconComponent: React.ElementType;
    fontSize?: "inherit" | "default" | "small" | "large";
}

const SocialMediaIcon: React.FC<SocialMediaIconProps> = ({
    link,
    IconComponent,
    fontSize = "large",
}) => {
    const theme = useTheme();
    return (
        link && (
            <Link to={link} target="_blank" rel="noopener noreferrer">
                <IconButton
                    sx={{
                        transition: ".3s",
                        "&:hover": {
                            color: theme.palette.primary.main,
                            backgroundColor: 'transparent',
                            transform: 'scale(1.2) translate(0, -2px)'
                        },
                    }}
                >
                    <IconComponent fontSize={fontSize} />
                </IconButton>
            </Link>
        )
    );
};

export default SocialMediaIcon;
