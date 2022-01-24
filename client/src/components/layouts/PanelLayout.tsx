import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth';
import { useSocket } from '../context/socket';
import { isEqual, USER_SIGNED_OUT, ResponseBody } from '../../utils/response-constants'

const PanelLayout = () => {
  const {user, setUser} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {mainSocket} = useSocket()

  const handleSignOut = () => {
    mainSocket.emit('signout', (response: ResponseBody) => {
      if (isEqual(USER_SIGNED_OUT, response)) {
        return setUser(s => ({...s, user: '', authenticated: false}))
      }

      // if(code === 400 && status === 'user-not-authenticated') return setUser()
    })
  }
  console.log(location.pathname)

  return (
    <>
      <nav>
        <ul>
          <li>Zalogowano jako: {user.user}</li>
        </ul>
        <ul>
          {location.pathname === "/panel"
            ? <li>
                <button onClick={() => navigate("quiz/new")}>Stwórz nowy quiz</button>
              </li>
            :
            null
          }
          <li>
            <button onClick={(e) => {e.preventDefault(); handleSignOut();}} className="contrast">Wyloguj się</button>
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
