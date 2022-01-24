import { useEffect, useState } from "react";
import { isEqual, QUIZES_FOUND, ResponseBody } from "../../utils/response-constants";
import { useSocket } from "../context/socket";
import QuizCard from "../QuizCard";

const Panel = () => {
  const [quizes, setQuizes] = useState<any>([]);
  const [loading, setLoading] = useState(true)
  const {creatorSocket} = useSocket();
  useEffect(() => {
    creatorSocket.emit(
      'get-quizes',
      (response: ResponseBody) => {
        if(isEqual(QUIZES_FOUND, response)){
          setQuizes(response.payload);
        }
        setLoading(false);
      }
    )
  },[creatorSocket]);

  return (
    <div>
      {loading ? <p>Ładowanie...</p> : quizes.length ? quizes.map((quiz: any) => <QuizCard key={quiz._id} quiz={quiz} />) : <p>{'Brak zapisanych quizów :('}</p>}
    </div>
  )
}

export default Panel;
