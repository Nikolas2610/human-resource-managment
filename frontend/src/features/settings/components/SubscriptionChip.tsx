import { Chip } from "@mui/material";
import React from "react";
import { SubscriptionStatus } from "../enum/SubscriptionStatus";

const styles = {
    active: {
        backgroundColor: "green",
        color: "white",
    },
    past_due: {
        backgroundColor: "red",
        color: "white",
    },
    canceled: {
        backgroundColor: "gray",
        color: "white",
    },
    incomplete: {
        backgroundColor: "orange",
        color: "white",
    },
    incomplete_expired: {
        backgroundColor: "darkred",
        color: "white",
    },
    trialing: {
        backgroundColor: "blue",
        color: "white",
    },
    unpaid: {
        backgroundColor: "purple",
        color: "white",
    },
    active_to_cancel: {
        backgroundColor: "yellow",
        color: "black",
    },
};

interface SubscriptionChipProps {
    status: SubscriptionStatus;
}

const SubscriptionChip: React.FC<SubscriptionChipProps> = ({ status }) => {
    const getChipLabel = () => {
        switch (status) {
            case SubscriptionStatus.ACTIVE:
                return "Active";
            case SubscriptionStatus.PAST_DUE:
                return "Past Due";
            case SubscriptionStatus.CANCELED:
                return "Canceled";
            case SubscriptionStatus.INCOMPLETE:
                return "Incomplete";
            case SubscriptionStatus.INCOMPLETE_EXPIRED:
                return "Incomplete Expired";
            case SubscriptionStatus.TRIALING:
                return "Trialing";
            case SubscriptionStatus.UNPAID:
                return "Unpaid";
            case SubscriptionStatus.ACTIVE_TO_CANCEL:
                return "Active (To Cancel)";
            default:
                return "Unknown";
        }
    };

    return <Chip label={getChipLabel()} sx={styles[status]} />;
};

export default SubscriptionChip;
