import { Bounce, ToastContainer } from 'react-toastify';
import { RouterConfig } from './navigation/routerConfig';

function App() {

  return (
    <>
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
