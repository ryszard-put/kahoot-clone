import { BrowserRouter } from 'react-router-dom';

import RouteConfig from './components/routes/RouteConfig';
import { AuthProvider } from './components/context/auth';
import { SocketProvider } from './components/context/socket';

const App = () => {
  return (
    <BrowserRouter>
    <SocketProvider>
      <AuthProvider>
        <RouteConfig />
      </AuthProvider>
    </SocketProvider>
  </BrowserRouter>
  );
}

export default App;
