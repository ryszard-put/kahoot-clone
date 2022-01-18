import { useState } from "react";

const RoomAdminPanel = () => {
  const [connectedUsers, setConnectedUsers] = useState(20);
  const [readyUsers, setReadyUsers] = useState(["username", "username", "username", "username", "username", "username", "username", "username", "username", "username", "username", "username", "username", "username"]);

  return (
    <div>
      <hgroup>
        <h1>Liczba graczy: {connectedUsers}</h1>
        <h2>Liczba gotowych graczy: {readyUsers.length}</h2>
      </hgroup>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px'}}>
        {readyUsers.map((user, idx) => <article key={idx}>{user}</article>)}
      </div>
    </div>
  )
}

export default RoomAdminPanel
