import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import {
    Paper,
    Stack,
    Typography,
    keyframes,
    styled,
    useTheme,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { FailPaymentResponse } from "@/types/payments/FailPaymentResponse.type";

const scale = keyframes`
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
`;

const AnimatedIcon = styled(ErrorIcon)(({ theme }) => ({
    fontSize: "10rem",
    color: theme.palette.error.main,
    animation: `${scale} 1s ease-in-out`,
}));

export default function FailResponseCard({ data }: FailResponseCardProps) {
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
                    <AnimatedIcon />

                    <Typography variant="h2" gutterBottom  width={'75%'} textAlign={'center'}>
                        Payment Failed!
                    </Typography>
                    <Typography variant="h5" gutterBottom  width={'75%'} textAlign={'center'}>
                        {data?.message ?? "Payment failed!"}
                    </Typography>
                </Stack>
            </Paper>
        </FlexCenter>
    );
}

interface FailResponseCardProps {
    data: FailPaymentResponse;
}
