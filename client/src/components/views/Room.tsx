import { useEffect, useState } from "react";
import { useSocket } from "../context/socket";
import { isEqual, INVALID_ROOM_ID, ROOM_JOINED, ResponseBody } from "../../utils/response-constants";
import { useParams } from "react-router-dom";

// import { useParams } from "react-router-dom"


const Room = () => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [quizTitle, setQuizTitle] = useState("Tytuł quizu");
  const [quizDescription, setQuizDescription] = useState("Krótki opis Lorem ipsum dolor sit amet consectetur adipisicing elit.");
  const [ready, setReady] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const {participantSocket} = useSocket();
  const params = useParams();
  
  // TODO: connect to room with socket instance or notify that room does not exist
  useEffect(() => {
    setLoading(true);
    participantSocket.emit(
      'join-room',
      params.roomId,
      (response: ResponseBody) => {
        console.log(response)
        if(isEqual(INVALID_ROOM_ID, response)){
          setQuizTitle('INVALID ROOM ID');
          setQuizDescription('INVALID ROOM ID');
        }
        if(isEqual(ROOM_JOINED, response)){
          setQuizTitle(response.payload.title);
          setQuizDescription(response.payload.description);
        }
        setLoading(false);
      },
    )
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
          {quizTitle}
        </header>
        {quizDescription}
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
