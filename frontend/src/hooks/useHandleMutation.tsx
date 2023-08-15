import generateResponseMessage, { CRUDOperation } from "@/utils/helpers/generateResponseMessage";
import { useHandleServerError } from "./useHandleServerError";
import useSuccessSnackbar from "./useSuccessSnackbar";
import useToggleDashboardLoading from "./useToggleDashboardLoading";

export function useHandleMutation(props: HandleMutationProps) {
    const {
        isLoading,
        isSuccess,
        isError,
        error,
        entityType,
        actionType,
        redirectTo,
    } = props;

    useToggleDashboardLoading(isLoading);
    useHandleServerError(isError, error);

    useSuccessSnackbar({
        isSuccess,
        message: generateResponseMessage(entityType, actionType),
        to: redirectTo,
    });
}

interface HandleMutationProps {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: any; 
    entityType: string;
    actionType: CRUDOperation;
    redirectTo: string;
}
