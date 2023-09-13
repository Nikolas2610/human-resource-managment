import { useDispatch } from "react-redux";
import { setSnackbar } from "@/features/snackbars/snackbarSlice";

import useToggleDashboardLoading from "./useToggleDashboardLoading";
import { useModalContext } from "@/contexts/ModalContext";
import { SnackBarSeverity } from "@/features/snackbars/enums/SnackBarSeverity.enum";

// Define the type for the mutation state object
interface MutationStates {
    isSuccess: boolean;
    isError: boolean;
}

// Define the type for the deleteMutation function
type DeleteMutation = (id: any) => Promise<any>;

const useDeleteEntity = (isLoading: boolean) => {
    const dispatch = useDispatch();
    const { showModal } = useModalContext();

    useToggleDashboardLoading(isLoading);

    const handleDelete = async (
        id: any,
        name: string,
        companyId: number,
        deleteMutation: DeleteMutation,
        mutationStates: MutationStates
    ) => {
        const { isSuccess, isError } = mutationStates;

        showModal(`Are you sure you want to delete the ${name}?`, async () => {
            try {
                await deleteMutation({ companyId, id });

                if (isSuccess) {
                    dispatch(
                        setSnackbar({
                            message: `${name} was deleted successfully!`,
                            severity: SnackBarSeverity.SUCCESS,
                        })
                    );
                } else if (isError) {
                    dispatch(
                        setSnackbar({
                            message: `Failed to delete the ${name}.`,
                            severity: SnackBarSeverity.ERROR,
                        })
                    );
                }
            } catch (err: any) {
                dispatch(
                    setSnackbar({
                        message: err.message || "An unexpected error occurred.",
                        severity: SnackBarSeverity.ERROR,
                    })
                );
            }
        });
    };

    return handleDelete;
};

export default useDeleteEntity;
