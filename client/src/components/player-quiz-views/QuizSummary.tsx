import {FC } from 'react';

export interface IQuizSummaryProps {
  summary: { [key: string]: number };
  username: string;
}

const QuizSummary: FC<IQuizSummaryProps> = ({summary, username}) => {
  const mapSummaryToSortedScoreBoard = () => {
    const scoreBoard: {player: string; score: number}[] = [];

    for(let username in summary) scoreBoard.push({player: username, score: summary[username]});

    scoreBoard.sort((a,b) => b.score - a.score);

    return scoreBoard;
  }

  return <div>
    <h1>Podsumowanie</h1>
    <article>Twój wynik: {summary[username]}</article>
    <div>
      {mapSummaryToSortedScoreBoard().slice(0,3).map((entry, idx) => {
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
