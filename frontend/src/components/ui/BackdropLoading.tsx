import { Backdrop, CircularProgress } from "@mui/material";

interface BackdropLoadingProps {
    isLoading: boolean;
}

export default function BackdropLoading({ isLoading }: BackdropLoadingProps) {
    return (
        <Backdrop
            sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={isLoading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}
