import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../context/auth";
import Layout from "../layouts/Layout";
import PanelLayout from "../layouts/PanelLayout";
import Home from "../views/Home";
import NewQuiz from "../views/NewQuiz";
import Panel from "../views/Panel";
import Room from "../views/Room";
import RoomAdminPanel from "../views/RoomAdminPanel";

const ProtectedRoute = ({children}) => {
  const {user} = useAuth();
  if(!user.authenticated) return <Navigate to="/" replace />
  return children
}

const RouteConfig = () => {
  return <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path=":roomId" element={<Room />} />
    </Route>
    <Route path="/panel" element={<ProtectedRoute><PanelLayout /></ProtectedRoute>}>
      <Route index element={<Panel />} />
      <Route path="quiz/new" element={<NewQuiz />} />
      <Route path="quiz/:roomId" element={<RoomAdminPanel />} />
    </Route>
  </Routes>
}

export default RouteConfig;