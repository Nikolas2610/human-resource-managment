import { useDispatch } from "react-redux";
import PositionForm from "../forms/PositionForm";
import { useEffect } from "react";
import { setPageTitle } from "@/features/dashboard/dashboardSlice";

export default function CreatePositionPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle("Create Position"));
    }, [dispatch]);

    return <PositionForm formTitle="Create Position" />;
}
