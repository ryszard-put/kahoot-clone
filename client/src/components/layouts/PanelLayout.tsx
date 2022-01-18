import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth';

const PanelLayout = () => {
  const {user, setUser} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <nav>
        <ul>
          <li>Zalogowano jako: {user.userId}</li>
        </ul>
        <ul>
          {!location.pathname.includes("quiz/new")
            ? <li>
                <button onClick={() => navigate("quiz/new")}>Stwórz nowy quiz</button>
              </li>
            :
            null
          }
          <li>
            <button onClick={() => {setUser(s => ({...s, authenticated: false}));}} className="contrast">Wyloguj się</button>
          </li>
        </ul>
      </nav>
      <div className="container">
        <Outlet />
      </div>
    </>
  )
}

export default PanelLayout
