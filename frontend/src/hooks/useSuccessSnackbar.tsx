import { setSnackbar } from '@/features/snackbars/snackbarSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

type UseSuccessSnackbarProps = {
    isSuccess: boolean;
    message: string;
    to?: string | null;
};

const useSuccessSnackbar = ({ isSuccess, message, to = null }: UseSuccessSnackbarProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            dispatch(setSnackbar({ message }));
            if (to) {
                navigate(to);
            }
        }
    }, [dispatch, history, isSuccess, message, to]);
}

export default useSuccessSnackbar;
