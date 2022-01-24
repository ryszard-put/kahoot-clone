import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { TQuizState } from '../views/RoomAdminPanel'
import { isEqual, INVALID_ROOM_ID, ROOM_JOINED, ResponseBody, QUIZ_DATA_SENT, QUIZ_ALREADY_STARTED, USERNAME_TAKEN } from "../../utils/response-constants";
import { useSocket } from "../context/socket";
import QuizOpenView from "../player-quiz-views/QuizOpenView";
import QuizQuestionSummary from "../player-quiz-views/QuizQuestionSummary";
import QuizQuestionRunning from "../player-quiz-views/QuizQuestionRunning";
import useInterval from "../../utils/hooks/useInterval";
import QuizSummary from "../player-quiz-views/QuizSummary";

// import { useParams } from "react-router-dom"

const Room = () => {
  const [loading, setLoading] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizQuestionCount, setQuizQuestionCount] = useState(0);
  const [quizState, setQuizState] = useState<TQuizState>("OPEN")
  const [ready, setReady] = useState(false);
  const [connectedPlayers, setConnectedPlayers] = useState(0);

  const [summary, setSummary] = useState({});
  const [summaryUsername, setSummaryUsername] = useState("");
  const [question, setQuestion] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(null);
  const [nextQuestion, setNextQuestion] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [answersCount, setAnswersCount] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);

  const {participantSocket} = useSocket();
  const {roomId} = useParams();
  const navigate = useNavigate();
  
  // TODO: set socket events
  useEffect(() => {
    setLoading(true);
    participantSocket.emit('get-quiz-data', roomId, (response: ResponseBody) => {
      if(isEqual(QUIZ_DATA_SENT, response)){
        setQuizTitle(response.payload.title);
        setQuizDescription(response.payload.description);
        setQuizQuestionCount(response.payload.questionCount);
        setLoading(false)
      } else if (isEqual(INVALID_ROOM_ID, response)) {
        navigate('/', {replace: true, state: response.status})
      } else if(isEqual(QUIZ_ALREADY_STARTED, response)) {
        console.log(response.status);
        navigate('/', {replace: true, state: response.status})
      }
    })

    participantSocket
      .on('update-player-count', (payload: number) => setConnectedPlayers(payload))
      .on('room-closed', () => navigate('/', {replace: true, state: 'room-closed'}))
      .on('quiz-started', () => {
        setQuizState("PAUSED");
        setNextQuestion(0);
      })
      .on('next-question-started', (payload: {question: string, timeToAnswer: number, answers: string[]}) => {
        setQuestion(payload.question);
        setRemainingTime(payload.timeToAnswer);
        setAnswers(payload.answers);
        setSelectedAnswer(-1);
        setQuizState("RUNNING");
      })
      .on('question-closed', (payload: {summary: number[], correctAnswer: number}) => {
        console.log(payload);
        setQuizState("PAUSED");
        setAnswersCount(payload.summary);
        setCorrectAnswer(payload.correctAnswer);
        setNextQuestion(s => ++s);
      })
      .on('quiz-closed', (payload: {summary: {[key: string]: number}, username: string}) => {
        setQuizState("CLOSED");
        setSummary(payload.summary);
        setSummaryUsername(payload.username);
      })

    return () => {
      participantSocket.off('update-player-count').off('room-closed').off('quiz-started').off('next-question-started').off('question-closed').off('quiz-closed');
    }
  }, [navigate, roomId, participantSocket])

  useInterval(() => {
    if (remainingTime > 1) setRemainingTime(s => --s)
    else setQuizState("PAUSED");
  }, quizState === "RUNNING" ? 1000 : null);

  const onUsernameSubmit = (username: string) => {
    if(username){
      participantSocket.emit(
        'join-room',
        roomId,
        username,
        (response: ResponseBody) => {
          console.log(response);
          if (isEqual(INVALID_ROOM_ID, response)) {
            navigate('/', {replace: true, state: response.status})
          } else if(isEqual(QUIZ_ALREADY_STARTED, response)) {
            navigate('/', {replace: true, state: response.status})
          } else if (isEqual(USERNAME_TAKEN, response)) {
            // TODO: notify user that username is taken
            alert(response.status)
          }
          else if (isEqual(ROOM_JOINED, response)) {
            setReady(true);
            setConnectedPlayers(response.payload);
          }
        },
      )
    } else alert('Nie podano nazwy użytkownika');
    
  }

  if(loading) return <article aria-busy="true">ŁĄCZENIE Z SERWEREM</article>

  const renderQuizState = () => {
    switch(quizState){
      case "OPEN": return <QuizOpenView quizMetaData={{quizTitle, quizDescription, quizQuestionCount, connectedPlayers}} ready={ready} onUsernameSubmit={onUsernameSubmit} />
      case "PAUSED": return <QuizQuestionSummary selectedAnswer={selectedAnswer} questionNumber={nextQuestion} answersCount={answersCount} beforeFirstQuestion={quizState === "PAUSED" && nextQuestion === 0} question={{question,correctAnswer, answers}} />
      case "RUNNING": return <QuizQuestionRunning selectedAnswer={selectedAnswer} setSelectedAnswer={setSelectedAnswer} questionNumber={nextQuestion} question={question} answers={answers} remainingTime={remainingTime} />
      case "CLOSED": return <QuizSummary summary={summary} username={summaryUsername} />
    } 
  }

  return (
    <div>
      {renderQuizState()}
    </div>
  )
}

export default Room
