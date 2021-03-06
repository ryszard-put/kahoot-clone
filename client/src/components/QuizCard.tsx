import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../utils/notifications";
import { INVALID_QUIZ_ID, isEqual, ResponseBody, ROOM_OPENED } from "../utils/response-constants";
import { useSocket } from "./context/socket";


const QuizCard = ({quiz}) => {
  const {creatorSocket} = useSocket();
  const navigate = useNavigate();
  const handleRoomCreation = (e) => {
    e.preventDefault();
    creatorSocket.emit('open-room', quiz._id, (response: ResponseBody) => {
      if(isEqual(ROOM_OPENED, response)) {
        showSuccess('Otwarto pokój')
        navigate(`quiz/${response.payload}`);
      } else if(isEqual(INVALID_QUIZ_ID, response)) {
        showError('COŚ POSZŁO NIE TAK');
        throw new Error("NO JEST PROBLEM")
      }
    })
  }

  return <article>
    <p>{quiz.title}</p>
    <button onClick={handleRoomCreation}>Stwórz pokój</button>
  </article>;
};

export default QuizCard;
