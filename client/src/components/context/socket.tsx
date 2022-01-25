import {createContext, FC, useContext, useEffect} from 'react'
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { showError, showSuccess } from '../../utils/notifications';

const config: Partial<ManagerOptions & SocketOptions> = {
  transports: ['websocket'],
  path: "/ws",
}

export interface SocketData {
  mainSocket: Socket;
  creatorSocket: Socket;
  participantSocket: Socket;
}

export const socketContext = createContext<SocketData>(null);

export const useSocket = () => useContext(socketContext);

const mainSocket = io("/", config);
const creatorSocket = io("/creator", config);
const participantSocket = io("/participant", config);

export const SocketProvider: FC = ({children}) => {

  useEffect(() => {
    mainSocket.on('connect', () => showSuccess('Ustanowiono połączenie z serwerem'));
    mainSocket.on('error', () => showError('Wystąpił błąd serwera'));
    mainSocket.on('reconnect_attempt', () => showError('Próbujemy ustanowić połączenie z serwerem'));
    mainSocket.on('reconnect_error', () => showError('Wystąpił błąd w trakcie ponownego łączenia sie z serwerem'));
    mainSocket.on('reconnect_failed', () => showError('Próba ponownego połączenia nie powiodła się'));
    mainSocket.on('disconnect', () => showError('Utracono połączenie z serwerem'));

    return () => {
      mainSocket.off('connect').off('error').off('reconnect_attempt').off('reconnect_error').off('reconnect_failed').off('disconnect')
    }
  })

  return <socketContext.Provider value={{mainSocket, creatorSocket, participantSocket}}>
    {children}
  </socketContext.Provider>
}