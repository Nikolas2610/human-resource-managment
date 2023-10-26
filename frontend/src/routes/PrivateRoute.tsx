import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserRole } from "@/features/auth/enums/UserRole";
import {
    selectSubscriptionAccessLevel,
    selectUserRole,
} from "@/features/auth/authSlice";
import { SubscriptionAccessLevel } from "@/types/subscriptions/SubscriptionAccessLevel.enum";
import RouteList from "./RouteList";

interface PrivateRouteProps {
    roles: string[];
    accessLevels: SubscriptionAccessLevel[];
}

const PrivateRoute = ({ roles, accessLevels }: PrivateRouteProps) => {
    let location = useLocation();
    const userRole = useSelector(selectUserRole);
    const userSubscriptionLevel = useSelector(selectSubscriptionAccessLevel);
    console.log(userRole);
    console.log(userSubscriptionLevel);
    console.log(location);

    if (userRole === UserRole.GUEST) {
        // User is not logged in, redirect to login page
        return <Navigate to={RouteList.login} state={{ from: location }} />;
    } else if (!accessLevels.includes(userSubscriptionLevel)) {
        console.log(
            "User does not have the required subscription access level"
        );
        // User doesn't have the required subscription access level, redirect to a subscription upgrade page or dashboard
        if (userSubscriptionLevel === SubscriptionAccessLevel.EXPIRED) {
            return <Navigate to={RouteList.subscription} />;
        } else {
            return <Navigate to={RouteList.dashboard} />;
        }
    } else if (!roles.includes(userRole)) {
        console.log("User does not have the required role");
        // User doesn't have the required role, redirect to dashboard or any other page
        return <Navigate to={RouteList.dashboard} />;
    } else {
        console.log(accessLevels);

        console.log("User has the required subscription access level");
        // User is logged in, has the required role and subscription access level, render the children
        return <Outlet />;
    }
};

export default PrivateRoute;
