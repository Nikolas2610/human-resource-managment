import { toggleDashboardLoading } from '@/features/dashboard/dashboardSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';


const useToggleDashboardLoading = (isLoading: boolean) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(toggleDashboardLoading(isLoading));
    }, [dispatch, isLoading]);
}

export default useToggleDashboardLoading;
