import { FC, useState } from "react";

export interface IQuizOpenViewProps {
  quizMetaData: {
    quizTitle: string;
    quizDescription: string;
    quizQuestionCount: number;
    connectedPlayers: number;
  }
  ready: boolean;
  onUsernameSubmit: (username: string) => void;
}

const QuizOpenView: FC<IQuizOpenViewProps> = ({quizMetaData: {quizTitle, quizDescription, connectedPlayers, quizQuestionCount}, ready, onUsernameSubmit}) => {
  const [username, setUsername] = useState("")

  return <div className="grid">
      <article>
        <header>
          {quizTitle}
        </header>
        <p>{quizDescription}</p>
        <span>Liczba pytań: {quizQuestionCount}</span>
      </article>
      <div className="grid" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div>
          {
            ready
              ? <>
                  <hgroup>
                    <h3>{username}: Oczekiwanie na rozpoczęcie</h3>
                    <h4>Liczba graczy: {connectedPlayers}</h4>
                  </hgroup>
                </>
              : <form>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nazwa użytkownika" />
                  <button onClick={(e) => {e.preventDefault(); onUsernameSubmit(username)}}>Podaj nick</button>
                </form>
          }
        </div>
      </div>
    </div>;
};

export default QuizOpenView;
