import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { ANSWER_SENT, isEqual, ResponseBody } from '../../utils/response-constants';
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
        }
      })
    }
  }

  return <div> 
    <article>
      <p><strong>Pytanie #{questionNumber}:</strong> {question}</p>
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
