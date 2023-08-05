import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    useTheme,
    IconButton,
} from "@mui/material";
import { useModalContext } from "@/contexts/ModalContext";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import CloseIcon from "@mui/icons-material/Close";
import { FC } from "react";

const ConfirmModal: FC = () => {
    const { modalState, closeModal } = useModalContext();
    const theme = useTheme();

    const handleConfirm = () => {
        modalState.action();
        closeModal();
    };

    return (
        <Dialog
            open={modalState.isOpen}
            onClose={closeModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                width: {
                    xs: "95%",
                    sm: 500,
                    md: 800,
                    lg: 1000,
                    xl: 1200,
                },
                margin: "0 auto",
            }}
        >
            <FlexBetween borderBottom={1} borderColor={theme.palette.grey[300]}>
                <DialogTitle fontSize={30} id="alert-dialog-title">
                    {"Confirmation"}
                </DialogTitle>
                <Box sx={{ paddingX: 3 }}>
                    <IconButton onClick={closeModal}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </FlexBetween>

            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {modalState.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ paddingX: 3, paddingBottom: 2 }}>
                <Button
                    onClick={closeModal}
                    color="error"
                    autoFocus
                    variant="outlined"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    color="error"
                    variant="contained"
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal;
