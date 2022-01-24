import { useState } from "react"
import { useNavigate } from "react-router-dom"

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("")
  const navigate = useNavigate();

  return <form>
    <div className="grid">
      <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Id pokoju" />
    </div>
    
    <button onClick={e => {e.preventDefault();navigate(`/${roomId}`, {replace: true})}}>Dołącz do pokoju</button>
  </form>
}

export default JoinRoom