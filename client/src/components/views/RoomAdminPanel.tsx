import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useInterval from "../../utils/hooks/useInterval";
import { INSUFFICIENT_PERMISSIONS, isEqual, NO_MORE_QUESTIONS, QUESTION_DATA_SENT, QUIZ_CLOSED, QUIZ_STARTED, ResponseBody, ROOM_NOT_OPEN, ROOM_NOT_PAUSED, USER_NOT_AUTHENTICATED } from "../../utils/response-constants";
import QuizOpenView from "../admin-quiz-views/QuizOpenView";
import QuizQuestionsPreview from "../admin-quiz-views/QuizQuestionsPreview";
import QuizSummary from "../admin-quiz-views/QuizSummary";
import { useSocket } from "../context/socket";

export interface IQuestion {
  _id: string;
  question: string;
  correctAnswer: number;
  timeToAnswer: number;
  answers: string[];
}

export type TQuizState = "OPEN" | "RUNNING" | "PAUSED" | "CLOSED";

const RoomAdminPanel = () => {
  const [loading, setLoading] = useState(true)
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [summary, setSummary] = useState({});
  const [quizState, setQuizState] = useState<TQuizState>("OPEN");
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [answers, setAnswers] = useState<number[][]>(null);
  const [nextQuestion, setNextQuestion] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const {creatorSocket} = useSocket();
  const {roomId} = useParams();
  const navigate = useNavigate();

  const startQuestionHandle = () => {
    creatorSocket.emit('start-next-question', roomId, (response: ResponseBody) => {
      if (isEqual(QUESTION_DATA_SENT, response)) {
        setRemainingTime(+response.payload);
        setQuizState("RUNNING");
      } else if (isEqual(USER_NOT_AUTHENTICATED, response)) {
        navigate('/', {replace: true, state: response.status});
      } else if (isEqual(INSUFFICIENT_PERMISSIONS, response)) {
        // TODO: it is almost impossible, but react to this
      } else if (isEqual(ROOM_NOT_PAUSED, response)) {
        // TODO: it is almost impossible, but react to this
      } else if (isEqual(NO_MORE_QUESTIONS, response)) {
        // TODO: it is almost impossible, but react to this
      }
    });
  }

  const startQuizHandle = () => {
    creatorSocket.emit('start-quiz', roomId, (response: ResponseBody) => {
      if (isEqual(QUIZ_STARTED, response)) {
        setQuestions(response.payload as IQuestion[]);
        setAnswers(Array.from({length: response.payload.length}, (_, idx) => (Array.from({length: response.payload[idx].answers.length}, () => 0))))
        setQuizState("PAUSED");
        setNextQuestion(0);
      } else if (isEqual(USER_NOT_AUTHENTICATED, response)) {
        navigate('/', {replace: true, state: response.status});
      } else if (isEqual(INSUFFICIENT_PERMISSIONS, response)) {
        // TODO: it is almost impossible, but react to this
      } else if (isEqual(ROOM_NOT_OPEN, response)) {
        // TODO: it is almost impossible, but react to this
      }
    })
  }

  const closeQuizHandle = (e) => {
    e.preventDefault();
    creatorSocket.emit('close-quiz', roomId, (response: ResponseBody) => {
      if(isEqual(QUIZ_CLOSED, response)) {
        setQuizState("CLOSED");
        setSummary(response.payload);
      }
    })
  }

  useInterval(() => {
    if (remainingTime > 1) setRemainingTime(s => --s)
    else setQuizState("PAUSED");
  }, quizState === "RUNNING" ? 1000 : null);

  useEffect(() => {
    creatorSocket.on('update-players', (players: string[]) => {
      setConnectedPlayers(players);
    })

    creatorSocket.on('question-closed', () => {
      setQuizState("PAUSED");
      setNextQuestion(s => ++s);
    })

    creatorSocket.on('update-answers', (summary: number[], questionIndex: number) => {
      setAnswers(s => s.map((prev, idx) => idx === questionIndex ? summary : prev));
    })

    setLoading(false);

    return () => {
      creatorSocket.off('update-players').off('question-closed').off('update-answers');
    }
  }, [creatorSocket]);

  const renderQuizState = () => {
    switch(quizState){
      case "OPEN": return <QuizOpenView startQuizHandle={startQuizHandle} connectedPlayers={connectedPlayers} />
      case "PAUSED":
      case "RUNNING":  
        return (
          <>
            <QuizQuestionsPreview
              remainingTime={remainingTime}
              startQuestionHandle={startQuestionHandle}
              nextQuestion={nextQuestion}
              questions={questions}
              quizState={quizState}
              answers={answers}
            />
            <button disabled={nextQuestion < questions.length} onClick={closeQuizHandle}>Pokaż podsumowanie</button>
          </>
        )
      case "CLOSED": return <QuizSummary summary={summary} />
    } 
  }

  return (
    <div>
      {
        loading
          ? <p>Konfigurowanie pokoju...</p>
          : <div>
              <hgroup>
                <h1>Kod pokoju: {roomId}</h1>
                <h2>Liczba graczy: {connectedPlayers.length}</h2>
              </hgroup>
              {renderQuizState()}
            </div>
      }
    </div>
  )
}

export default RoomAdminPanel
