import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom"


const Room = () => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [ready, setReady] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  // const params = useParams();
  
  // TODO: connect to room with socket instance or notify that room does not exist
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [])

  const onUsernameSubmit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    // TODO: send username to server and become ready for start of a quiz
    if(username) setReady(true);
  }

  if(loading) return <article aria-busy="true">ŁĄCZENIE Z SERWEREM</article>

  return (
    <div className="grid">
      <article>
        <header>
          Tytuł quizu
        </header>
        Krótki opis Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </article>
      <div className="grid" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div>
          {
            ready
              ? <>
                  <hgroup>
                    <h3>Oczekiwanie na uruchomienie</h3>
                    <h4>Liczba graczy: {playerCount}</h4>
                  </hgroup>
                </>
              : <form>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nazwa użytkownika" />
                  <button onClick={onUsernameSubmit}>Podaj nick</button>
                </form>
          }
        </div>
      </div>
    </div>
  )
}

export default Room
