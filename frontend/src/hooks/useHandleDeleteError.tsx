import { SnackBarSeverity } from '@/features/snackbars/enums/SnackBarSeverity.enum';
import { setSnackbar } from '@/features/snackbars/snackbarSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

type DeleteError = {
  status: number;
  data: {
    error: string;
    message: string;
  };
};

export const useHandleDeleteError = (
  isDeleteError: boolean,
  deleteError: DeleteError | any
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isDeleteError) {
      let errorMessage: string;

      if (typeof deleteError === 'object' && deleteError?.data?.message) {
        errorMessage = deleteError.data.message;
      } else {
        errorMessage = 'An unexpected error occurred.';
      }

      dispatch(
        setSnackbar({
          message: errorMessage,
          severity: SnackBarSeverity.ERROR,
        })
      );
    }
  }, [isDeleteError, deleteError, dispatch]);
};
