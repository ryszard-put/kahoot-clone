import { useState, ChangeEventHandler } from 'react'
import Ajv from 'ajv';
import QuizSettings from '../QuizSettings';
import { useNavigate } from 'react-router-dom';

// export interface IQuizQuestion {
//   question: string;
//   correctAnswer: number; // array index (from 0)
//   answers: string[];
//   timeToAnswer: number; // in seconds
// }

// export interface IQuizFile {
//   title: string;
//   description: string;
//   questions: IQuizQuestion[];
// }


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
  const navigate = useNavigate();

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    
    if (event.target.files.length !== 1) return alert('Blad przeslania pliku');
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        console.log(event.target.result);
        // const data: IQuizFile = JSON.parse(event.target.result as string) as IQuizFile;
        const data = JSON.parse(event.target.result as string)
        const valid = validate(data);
        if(valid){
          setQuizData(data);
        } else {
          console.log(validate.errors)
        }
      } catch(exc) {
        console.log(exc)
        console.log("Niepoprawny format pliku")
      }
    };

    reader.readAsText(file);
  }

  const onQuizCreate: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    navigate(`/panel/quiz/123456`, {replace: true});
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
              <button onClick={onQuizCreate}>Uruchom quiz</button>
            </>
          : null
      }
    </>
  )
}

export default NewQuiz
