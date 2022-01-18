import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";


const SignIn = () => {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const {user, setUser} = useAuth();
  const navigate = useNavigate();

  const onSubmit = /* async */ () => {
    if(!username || !token) return;
    setUser(s => ({...s, authenticated: true, userId: username}));
    navigate("/panel");
  }

  if(user.authenticated) return <Navigate to="/panel" replace />

  return <form>
    <div className="grid">
      <div>
        <input type="text" placeholder="Login" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <input type="text" placeholder="Token" value={token} onChange={(e) => setToken(e.target.value)} />
      </div>
    </div>
    <button onClick={(e) => {e.preventDefault();onSubmit()}}>Zaloguj się</button>
  </form>
}

export default SignIn;