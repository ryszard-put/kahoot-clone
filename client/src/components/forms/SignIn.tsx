import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isEqual, ResponseBody, USER_AUTHENTICATED, USER_SIGNED_OUT } from "../../utils/response-constants";
import { useAuth } from "../context/auth";
import { useSocket } from "../context/socket";


const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {user, setUser} = useAuth();
  const navigate = useNavigate();
  const {mainSocket, creatorSocket} = useSocket();

  const onSubmit = /* async */ () => {
    if(!username || !password) return;
    mainSocket.emit("signin", {username, password}, (response: ResponseBody) => {
      if(isEqual(USER_AUTHENTICATED, response)) {
        setUser(s => ({...s, authenticated: true, user: username}))
      }
    });
  }


  if(user.authenticated) return <Navigate to="/panel" replace />

  return <form>
    <div className="grid">
      <div>
        <input type="text" placeholder="Login" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
    </div>
    <button onClick={(e) => {e.preventDefault();onSubmit()}}>Zaloguj się</button>
    <button onClick={(e) => {e.preventDefault();mainSocket.emit('test-session')}}>test session</button>
  </form>
}

export default SignIn;