import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "../app/store"; // The location of your root reducer

interface PrivateRouteProps {
    roles: string[];
}

const PrivateRoute = ({ roles }: PrivateRouteProps) => {
    let location = useLocation();
    const { user } = useSelector((state: RootState) => state.auth); // Use selector to access Redux state
    const { isAppLoading } = useSelector((state: RootState) => state.dashboard); // Use selector to access Redux state

    if (!isAppLoading) {
        if (!user) {
            // User is not logged in, redirect to login page
            return <Navigate to="/auth/login" state={{ from: location }} />;
        } else if (!roles.includes(user.role)) {
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
    }
};

export default PrivateRoute;
