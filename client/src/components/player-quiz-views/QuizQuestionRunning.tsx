import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { showError } from '../../utils/notifications';
import { ANSWER_SENT, INVALID_ANSWER, INVALID_ROOM_ID, isEqual, NO_USERNAME, QUIZ_NOT_RUNNING, ResponseBody } from '../../utils/response-constants';
import { useSocket } from '../context/socket';

export interface IQuizQuestionRunningProps {
  question: string;
  answers: string[];
  remainingTime: number;
  questionNumber: number;
  selectedAnswer: number;
  setSelectedAnswer: (x: number) => void;
}

const QuizQuestionRunning: FC<IQuizQuestionRunningProps> = ({question, answers, remainingTime, questionNumber, selectedAnswer, setSelectedAnswer}) => {
  const {participantSocket} = useSocket();
  const {roomId} = useParams();

  const submitAnswerHandle = (idx: number) => {
    if(selectedAnswer === -1){
      participantSocket.emit('answer-question', roomId, idx, (response: ResponseBody) => {
        if(isEqual(ANSWER_SENT, response)) {
          setSelectedAnswer(idx);
        } else if(isEqual(INVALID_ROOM_ID, response)) {
          showError('Niepoprawny numer pokoju');
        } else if(isEqual(NO_USERNAME, response)) {
          showError('Nie podano nazwy użytkownika');
        } else if(isEqual(QUIZ_NOT_RUNNING, response)) {
          showError('Odpowiedzi można udzielić w trakcie trwania pytania');
        } else if(isEqual(INVALID_ANSWER, response)) {
          showError('Tak odpowiedź nie istnieje');
        }
      })
    }
  }

  return <div> 
    <article>
      <p><strong>Pytanie #{questionNumber + 1}:</strong> {question}</p>
      <p>Pozostały czas: {remainingTime}</p>
    </article>
    <article>
      {answers.map((answer, idx) => <div key={answer}>{String.fromCharCode(65+idx)}. {answer}</div>)}
    </article>
    {selectedAnswer === -1
      ? <article className="grid">
          {answers.map((answer, idx) => <button key={idx+answer+idx} onClick={e => {e.preventDefault(); submitAnswerHandle(idx)}}>{String.fromCharCode(65+idx)}</button>)}
        </article>
      : <article>Wybrano odpowiedź {String.fromCharCode(65+selectedAnswer)}</article>
    }
  </div>
};

export default QuizQuestionRunning;
