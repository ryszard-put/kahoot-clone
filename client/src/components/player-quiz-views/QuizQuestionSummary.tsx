import { FC } from "react";

export interface IQuizQuestionSummaryProps {
  questionNumber: number;
  beforeFirstQuestion: boolean;
  answersCount: number[];
  question: {
    question: string;
    answers: string[];
    correctAnswer: number;
  };
  selectedAnswer: number;
}

const QuizQuestionSummary: FC<IQuizQuestionSummaryProps> = ({questionNumber, answersCount, beforeFirstQuestion,question, selectedAnswer}) => {
  return <div>
    <div>
      <h1>Oczekiwanie na pytanie #{questionNumber + 1}</h1>
    </div>
    {!beforeFirstQuestion
      ? <div>
          <h1>Podsumowanie pytania #{questionNumber}</h1>
          <article>
            <p>
              {question.question}
            </p>
            <div>
              {question.answers.map(((answer, idx) => <div key={question.question + answer}>{String.fromCharCode(65+idx)}. {answer}</div>))}
            </div>
          </article>
          <article>
            {answersCount.map(((score, idx) => {
              const style = {
                borderRadius: 'var(--border-radius)',
                backgroundColor:
                  idx === selectedAnswer && selectedAnswer !== question.correctAnswer
                    ? "var(--del-color)"
                    : idx === question.correctAnswer ? "var(--ins-color)" : "var(--muted-border-color)"
              }
              return (
                <article key={question.question+idx+score} style={style}>
                  {String.fromCharCode(65+idx)}: {score}
                </article>
              )
            }))}
          </article>
        </div>
      : null
    }
  </div>;
};

export default QuizQuestionSummary;
