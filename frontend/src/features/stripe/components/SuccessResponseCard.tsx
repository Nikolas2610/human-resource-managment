import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import { SuccessPaymentResponse } from "@/types/payments/SuccessPaymentResponse.type";
import { CheckCircleOutline } from "@mui/icons-material";
import {
    styled,
    Paper,
    Stack,
    Typography,
    Box,
    keyframes,
    useTheme,
} from "@mui/material";

const scale = keyframes`
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
`;

const AnimatedIcon = styled(CheckCircleOutline)(({ theme }) => ({
    fontSize: "10rem",
    color: theme.palette.success.main,
    animation: `${scale} 1s ease-in-out`,
}));

export default function SuccessResponseCard({
    data,
}: SuccessResponseCardProps) {
    const theme = useTheme();
    return (
        <FlexCenter height={"100%"} mt={4}>
            <Paper
                sx={{
                    padding: 5,
                    width: 700,
                    borderRadius: 4,
                    backgroundColor: theme.palette.background.default,
                }}
                elevation={2}
            >
                <Stack spacing={4} alignItems={"center"}>
                    <>
                        <AnimatedIcon />
                        <Typography variant="h4" gutterBottom>
                            Successful!
                        </Typography>
                        <Typography
                            variant="h5"
                            gutterBottom
                            width={"75%"}
                            textAlign={"center"}
                        >
                            {data && data.message
                                ? data.message
                                : "Payment Successful!"}
                        </Typography>
                        {data?.invoice && (
                            <Box textAlign={"center"}>
                                <Typography>
                                    Invoice number:{" "}
                                    {data?.invoice.invoice_number}
                                </Typography>
                                <Typography>
                                    Amount: {data?.invoice.amount_due}€
                                </Typography>
                            </Box>
                        )}
                    </>
                </Stack>
            </Paper>
        </FlexCenter>
    );
}

interface SuccessResponseCardProps {
    data: SuccessPaymentResponse;
}
