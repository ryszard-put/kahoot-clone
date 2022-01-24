import { FC } from "react";
import { IQuestion, TQuizState } from "../views/RoomAdminPanel";


export interface IQuestionPanelProps {
  question: IQuestion;
  questionIdx: number;
  nextQuestion: number;
  quizState: TQuizState;
  remainingTime: number;
  startQuestionHandle: () => void;
  answers: number[];
}

const QuestionPanel: FC<IQuestionPanelProps> = ({questionIdx, nextQuestion, question, quizState, remainingTime, startQuestionHandle, answers}) => {
  return <article>
    <div>
      <button
        disabled={quizState === "RUNNING" || questionIdx !== nextQuestion}
        onClick={e => {e.preventDefault();startQuestionHandle()}}
      >
        {quizState === "RUNNING" && questionIdx === nextQuestion
          ? `Pozostały czas: ${remainingTime}`
          : questionIdx < nextQuestion
            ? "Pytanie zakończone"
            : "Uruchom pytanie"
        }
      </button>
    </div>
    <p>{question.question}</p>
    <div style={{marginBottom: '2rem'}}>
      {question.answers.map(
        (answer, idx) => (
          <div key={question._id + idx}>
            {String.fromCharCode(65+idx)}: {answer}
          </div>)
      )}
    </div>
    <div className="grid">
      {answers.map(
        (score, idx) => {
          const style = {borderRadius: 'var(--border-radius)', backgroundColor: idx === question.correctAnswer ? "var(--ins-color)" : "var(--muted-border-color)", padding: '2rem'};
          return (
            <div key={question._id + idx} style={style}>
              {String.fromCharCode(65+idx)}: {score}
            </div>
          )
        }
      )}
    </div>
  </article>;
};

export default QuestionPanel;
