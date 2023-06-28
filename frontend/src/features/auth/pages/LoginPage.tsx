import { useDispatch } from "react-redux";
import { loginSuccess } from "../authSlice";
import { UserRole } from "../enums/UserRole";
import { Link } from "react-router-dom";

function LoginPage() {
  const dispatch = useDispatch();
  return (
    <div>
      <div>Login Page</div>
      <button onClick={() => dispatch(loginSuccess({ role: UserRole.EMPLOYEE }))}>
        Login Employee
      </button>
      <button onClick={() => dispatch(loginSuccess({ role: UserRole.HR }))}>
        Login HR
      </button>
      <Link to="/dashboard">
        <button>Dashboard</button>
      </Link>
    </div>
  );
}

export default LoginPage;
