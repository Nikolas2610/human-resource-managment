import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserRole } from "@/features/auth/enums/UserRole";
import { selectUserRole } from "@/features/auth/authSlice";

interface PrivateRouteProps {
    roles: string[];
}

const PrivateRoute = ({ roles }: PrivateRouteProps) => {
    let location = useLocation();
    const userRole = useSelector(selectUserRole);

    if (userRole === UserRole.GUEST) {
        // User is not logged in, redirect to login page
        return <Navigate to="/auth/login" state={{ from: location }} />;
    } else if (!roles.includes(userRole)) {
        // User doesn't have required role, redirect to dashboard or any other page
        return <Navigate to="/dashboard" />;
    } else {
        // User is logged in and has required role, render the children
        return (
            <>
                <Outlet />
            </>
        );
    }
};

export default PrivateRoute;
