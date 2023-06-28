import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./app/store";
import { loginFailure, loginSuccess } from "./features/auth/authSlice";
import Routers from "./routes/Routers";
import { UserRole } from "./features/auth/enums/UserRole";

function App() {
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");

    if (token) {
      dispatch(loginSuccess({ role: UserRole.HR }));
    } else {
      dispatch(loginFailure());
    }
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // Or any loading spinner
  }

  return <Routers />;
}

export default App;
