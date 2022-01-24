import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { INSUFFICIENT_PERMISSIONS, isEqual, ResponseBody, ROOM_CLOSED, ROOM_NOT_CLOSED, USER_NOT_AUTHENTICATED } from "../../utils/response-constants";
import { useSocket } from "../context/socket";

export interface IQuizSummaryProps {
  summary: { [key: string]: number };
}

const QuizSummary: FC<IQuizSummaryProps> = ({summary}) => {
  const {creatorSocket} = useSocket();
  const {roomId} = useParams();
  const navigate = useNavigate();

  const mapSummaryToSortedScoreBoard = () => {
    const scoreBoard: {player: string; score: number}[] = [];

    for(let username in summary) scoreBoard.push({player: username, score: summary[username]});

    scoreBoard.sort((a,b) => b.score - a.score);

    return scoreBoard;
  }

  const closeRoomHandle = (e) => {
    e.preventDefault();
    creatorSocket.emit('close-room', roomId, (response: ResponseBody) => {
      if (isEqual(ROOM_CLOSED, response)) {
        navigate('/panel', {replace: true, state: response.status});
      } else if (isEqual(ROOM_NOT_CLOSED, response)){
        // TODO: impossible
        console.error(response.status)
        navigate('/panel', {replace: true, state: response.status});
      } else if (isEqual(INSUFFICIENT_PERMISSIONS, response)) {
        console.error(response.status);
        navigate('/panel', {replace: true, state: response.status});
      } else if (isEqual(USER_NOT_AUTHENTICATED, response)) {
        console.error(response.status);
        navigate('/', {replace: true, state: response.status});
      }
    })
  }

  return <div>
    <h1>Podsumowanie</h1>
    <div>
      <button onClick={closeRoomHandle}>Zamknij pokój</button>
    </div>
    <div>
      {mapSummaryToSortedScoreBoard().map((entry, idx) => {
        const style =
          idx === 0
            ? {backgroundColor: 'gold', color: 'black'}
            : idx === 1
              ? {backgroundColor: 'silver', color: 'black'}
              : idx === 2
                ? {backgroundColor: 'sienna', color: 'black'}
                : null;
        return <article style={style} key={entry.player}>#{idx + 1}. {entry.player}: {entry.score}</article>
      })}
    </div>
  </div>;
};

export default QuizSummary;
