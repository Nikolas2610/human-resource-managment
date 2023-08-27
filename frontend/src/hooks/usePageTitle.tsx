import { setPageTitle } from "@/features/dashboard/dashboardSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const usePageTitle = (title: string) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle(title));
    }, [title, dispatch]);
};

export default usePageTitle;
