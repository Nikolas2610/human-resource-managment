import usePageTitle from "@/hooks/usePageTitle";
import LeaveRequestForm from "../forms/LeaveRequestForm";

export default function CreateLeaveRequest() {
    usePageTitle("Post Leave Request");
    return <LeaveRequestForm />;
}
