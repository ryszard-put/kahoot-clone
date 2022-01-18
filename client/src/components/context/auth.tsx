import {createContext, FC, useContext, useState} from 'react'

export interface IAuthState {
  authenticated: boolean;
  userId: string;
}

export interface IAuthContextData {
  user: IAuthState,
  setUser: React.Dispatch<React.SetStateAction<IAuthState>>
}

export const authContext = createContext<IAuthContextData>(null);

export const useAuth = () => useContext(authContext);

export const AuthProvider: FC = ({children}) => {
  const [user, setUser] = useState<IAuthState>({authenticated: false, userId: ""});

  return <authContext.Provider value={{user, setUser}}>
    {children}
  </authContext.Provider>
}