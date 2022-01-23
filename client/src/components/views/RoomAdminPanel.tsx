import { useEffect, useState } from "react";
import { useSocket } from "../context/socket";

const RoomAdminPanel = () => {
  const [loading, setLoading] = useState(true)
  const [connectedPlayers, setConnectedPlayers] = useState(0);
  const [readyPlayers, setReadyPlayers] = useState<string[]>([]);
  const {creatorSocket} = useSocket();

  useEffect(() => {
    creatorSocket.on('player-connected', () => {
      setConnectedPlayers(s => ++s);
    })

    creatorSocket.on('player-ready', (username: string) => {
      setReadyPlayers(s => ([...s, username]));
    })

    creatorSocket.on('player-left', (username: string) => {
      setConnectedPlayers(s => --s);
      setReadyPlayers(s => s.filter(value => value !== username));
    })

    setLoading(false);
  }, []);

  return (
    <div>
      {
        loading
          ? <p>Konfigurowanie pokoju...</p>
          : <>
              <hgroup>
                <h1>Liczba graczy: {connectedPlayers}</h1>
                <h2>Liczba gotowych graczy: {readyPlayers.length}</h2>
              </hgroup>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px'}}>
              {readyPlayers.map((user, idx) => <article key={idx}>{user}</article>)}
              </div>
            </>
      }
      
    </div>
  )
}

export default RoomAdminPanel
