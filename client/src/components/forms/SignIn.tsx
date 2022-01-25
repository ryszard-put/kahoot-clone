import { useState } from "react";
import { Navigate } from "react-router-dom";
import { showError, showInfo } from "../../utils/notifications";

import { isEqual, ResponseBody, USER_AUTHENTICATED, USER_NOT_FOUND } from "../../utils/response-constants";
import { useAuth } from "../context/auth";
import { useSocket } from "../context/socket";


const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidData, setInvalidData] = useState(false);
  const {user, setUser} = useAuth();
  const {mainSocket} = useSocket();

  const onSubmit = /* async */ () => {
    if(!username || !password) return;
    mainSocket.emit("signin", {username, password}, (response: ResponseBody) => {
      if(isEqual(USER_AUTHENTICATED, response)) {
        setUser(s => ({...s, authenticated: true, user: username}))
        showInfo('Zalogowano pomyślnie');
      } else if (isEqual(USER_NOT_FOUND, response)) {
        showError('Podano nieprawidłową nazwę lub hasło')
        setInvalidData(true);
      }
    });
  }


  if(user.authenticated) return <Navigate to="/panel" replace />

  return <form>
    <div className="grid">
      <div>
        {
          invalidData ?
            <input type="text" placeholder="Login" aria-invalid="true" value={username} onChange={(e) => {setInvalidData(false); setUsername(e.target.value)}} />
          :
            <input type="text" placeholder="Login" value={username} onChange={(e) => setUsername(e.target.value)} />
        }
      </div>
      <div>
        {
          invalidData ?
            <input type="password" placeholder="Hasło" aria-invalid="true" value={password} onChange={(e) => {setInvalidData(false); setPassword(e.target.value)}} />
          :
            <input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} />
        }
        
      </div>
    </div>
    <button onClick={(e) => {e.preventDefault();onSubmit()}}>Zaloguj się</button>
  </form>
}

export default SignIn;