import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "../../utils/notifications";
import { isEqual, QUIZES_FOUND, ResponseBody, USER_NOT_AUTHENTICATED } from "../../utils/response-constants";
import { useSocket } from "../context/socket";
import QuizCard from "../QuizCard";

const Panel = () => {
  const [quizes, setQuizes] = useState<any>([]);
  const [loading, setLoading] = useState(true)
  const {creatorSocket} = useSocket();
  const navigate = useNavigate();
  useEffect(() => {
    creatorSocket.emit(
      'get-quizes',
      (response: ResponseBody) => {
        if(isEqual(QUIZES_FOUND, response)){
          setQuizes(response.payload);
        } else if (isEqual(USER_NOT_AUTHENTICATED, response)) {
          navigate('/', {replace: true, state: response.status})
        }
        setLoading(false);
      }
    )
  },[creatorSocket, navigate]);

  return (
    <div>
      {loading ? <p>Ładowanie...</p> : quizes.length ? quizes.map((quiz: any) => <QuizCard key={quiz._id} quiz={quiz} />) : <p>{'Brak zapisanych quizów :('}</p>}
    </div>
  )
}

export default Panel;
