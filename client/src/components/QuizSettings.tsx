
const QuizSettings = ({data}) => {
  return (
    <div>
      <h2>{data.title}</h2>
      <p>{data.description}</p>
      {data.questions.map(({question, answers, correctAnswer, timeToAnswer}) => <article key={question}>
        <hgroup>
          <h2>Treść pytania: {question}</h2>
          <h4>Czas na odpowiedź: {timeToAnswer}</h4>
        </hgroup>
        <ol>
          {
            answers.map((answer, idx) => <li key={answer} style={idx == correctAnswer ? {textDecoration: 'underline'} : {}}>{answer}</li>)
          }
        </ol>
      </article>)}
    </div>
  )
}

export default QuizSettings
