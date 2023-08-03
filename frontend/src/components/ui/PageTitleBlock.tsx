import { Link } from "react-router-dom";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Button, Typography } from "@mui/material";
import FlexBetween from "./wrappers/FlexBetween";

export default function PageTitleBlock({
    formTitle,
    buttonText,
    to,
}: PageTitleBlockProps) {
    return (
        <FlexBetween>
            <Typography variant="h2" fontWeight={500}>
                {formTitle}
            </Typography>
            <Link to={to}>
                <Button variant="contained" startIcon={<KeyboardReturnIcon />}>
                    {buttonText}
                </Button>
            </Link>
        </FlexBetween>
    );
}

interface PageTitleBlockProps {
    formTitle: string;
    buttonText: string;
    to: string;
}
