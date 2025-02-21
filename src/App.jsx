import { Bounce, ToastContainer } from 'react-toastify';
import { RouterConfig } from './navigation/routerConfig';
import { Header } from './components/common/Header';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIsUserLoggedIn, setIsUserLoggedIn, setLoggedUserData, setSettingsData } from './redux/slicers.js/dataSlice';
import { auth } from './config/firebase';
import { fetchConstants } from './services/expenseServices';

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsUserLoggedIn);

  // handle login session
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setIsUserLoggedIn(true));
        dispatch(setLoggedUserData(user));
        const settings = await fetchConstants();
        dispatch(setSettingsData(settings));
      } else {
        dispatch(setIsUserLoggedIn(false));
      }
    });
  }, []);

  return (
    <>
      {isLoggedIn && <Header />}
      <RouterConfig />
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        transition={Bounce}
        theme="light"
        closeOnClick
      />
    </>
  );
}

export default App
