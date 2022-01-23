import { Schema, Model, Types, Document, model } from 'mongoose';

interface Question {
  question: String;
  correctAnswer: Number;
  timeToAnswer: Number;
  answers: String[];
}

interface Quiz {
  title: String;
  description: String;
  questions: Question[];
  owner: Types.ObjectId;
}

interface QuizDocument extends Quiz, Document {}

interface QuizModel extends Model<QuizDocument> {};

const QuizSchema = new Schema<QuizDocument>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    correctAnswer: {
      type: Number,
      required: true
    },
    timeToAnswer: {
      type: Number,
      required: true
    },
    answers: {
      type: [String],
      required: true,
      validate: [(arr: String[]) => arr.length === 4, 'invalid-size']
    }
  }]
});

const QuizModel = model<QuizDocument, QuizModel>('Quiz', QuizSchema);

export default QuizModel;