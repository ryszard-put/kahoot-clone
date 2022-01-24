import { FC } from 'react';

import { IQuestion, TQuizState } from '../views/RoomAdminPanel';
import QuestionPanel from './QuestionPanel';

export interface IQuizQuestionsPreviewProps {
  questions: IQuestion[];
  nextQuestion: number;
  quizState: TQuizState;
  remainingTime: number;
  startQuestionHandle: () => void;
  answers: number[][];
}

const QuizQuestionsPreview: FC<IQuizQuestionsPreviewProps> = ({nextQuestion,questions,quizState, remainingTime ,startQuestionHandle, answers}) => {
  console.log(answers)
  return <div>
    {questions.map((question, questionIdx) => 
      <QuestionPanel
        key={question._id}
        remainingTime={remainingTime}
        startQuestionHandle={startQuestionHandle}
        question={question}
        questionIdx={questionIdx}
        nextQuestion={nextQuestion}
        quizState={quizState}
        answers={answers[questionIdx]}
      />
    )}
  </div>;
};

export default QuizQuestionsPreview;
