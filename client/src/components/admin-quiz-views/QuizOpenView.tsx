import { FC } from 'react';

export interface IQuizOpenViewProps {
  connectedPlayers: string[];
  startQuizHandle: () => void;
}

const QuizOpenView: FC<IQuizOpenViewProps> = ({connectedPlayers, startQuizHandle}) => {
  return (
    <div>
      <div>
        <button onClick={(e) => {e.preventDefault(); startQuizHandle()}}>
          Uruchom quiz
        </button>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px'}}>
        {connectedPlayers.map((user, idx) => <article key={idx}>{user}</article>)}
      </div>
    </div>
  )
};

export default QuizOpenView;
