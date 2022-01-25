import { useState, ChangeEventHandler } from 'react'
import Ajv from 'ajv';
import QuizSettings from '../QuizSettings';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/socket';
import { isEqual, QUIZ_ADDED, ResponseBody, USER_NOT_AUTHENTICATED } from '../../utils/response-constants';
import { showError, showSuccess } from '../../utils/notifications';

const schema = {
  type: "object",
  required: ['title', 'description', 'questions'],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    questions: {
      type: "array",
      items: {
        type: "object",
        required: ['question', 'correctAnswer', 'timeToAnswer'],
        properties: {
          question: { type: "string" },
          correctAnswer: { type: "integer", minimum: 0, maximum: 3 },
          timeToAnswer: { type: "integer" },
          answers: {
            type: "array",
            items: {type: "string"},
            minItems: 4,
            maxItems: 4,
          }
        }
      }
    }
  }
}

const ajv = new Ajv();
const validate = ajv.compile(schema);

const NewQuiz = () => {
  const [quizData, setQuizData] = useState({});
  const [rawQuizData, setRawQuizData] = useState("");
  const navigate = useNavigate();
  const {creatorSocket} = useSocket();

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    
    if (event.target.files.length !== 1) return alert('Blad przeslania pliku');
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        console.log(event.target.result);
        const data = JSON.parse(event.target.result as string)
        const valid = validate(data);
        if (valid) {
          setQuizData(data);
          setRawQuizData(event.target.result as string);
          showSuccess('Quiz spełnia wymagania')
        } else {
          showError('Quiz nie spełnia wymagań')
          console.log(validate.errors)
        }
      } catch (exc) {
        console.log(exc)
        console.log("Niepoprawny format pliku")
        showError('Wystąpił błąd w trakcie przetwarzania pliku')
      }
    };

    reader.readAsText(file);
  }

  const onQuizCreate: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    creatorSocket.emit('add-quiz', rawQuizData, (response: ResponseBody) => {
      console.log(response);
      if(isEqual(QUIZ_ADDED, response)) {
        showSuccess('Pomyślnie dodano quiz')
        navigate(`/panel`, {replace: true});
      } else if (isEqual(USER_NOT_AUTHENTICATED, response)) {
        navigate('/', {replace: true, state: response.status})
      }
    })
  }

  return (
    <>
      <div>
        <input type="file" accept=".json" onChange={onFileChange} />
      </div>
      {
        Object.keys(quizData).length
          ? <>
              <QuizSettings data={quizData} />
              <button onClick={onQuizCreate}>Dodaj quiz</button>
            </>
          : null
      }
    </>
  )
}

export default NewQuiz
