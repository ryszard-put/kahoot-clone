import {createContext, FC, useContext} from 'react'
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

const config: Partial<ManagerOptions & SocketOptions> = {
  transports: ['websocket'],
  path: "/ws",
  withCredentials: true,
}

export interface SocketData {
  mainSocket: Socket;
  creatorSocket: Socket;
  participantSocket: Socket;
}

export const socketContext = createContext<SocketData>(null);

export const useSocket = () => useContext(socketContext);

const mainSocket = io("http://localhost:8080", config);
const creatorSocket = io("http://localhost:8080/creator", config);
const participantSocket = io("http://localhost:8080/participant", config);

export const SocketProvider: FC = ({children}) => {

  return <socketContext.Provider value={{mainSocket, creatorSocket, participantSocket}}>
    {children}
  </socketContext.Provider>
}