import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { loginStart, logout } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const login = (username: string, password: string) => {
    // dispatch start login action
    dispatch(loginStart());
    
    // call your login API
    // assuming it returns a Promise that resolves with the user role
    // loginApi(username, password)
    //   .then(user => {
    //     // dispatch success action on success
    //     dispatch(loginSuccess(user));
    //   })
    //   .catch(error => {
    //     // dispatch failure action on error
    //     dispatch(loginFailure());
    //   });
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return { ...auth, login, logout: logoutUser };
};
