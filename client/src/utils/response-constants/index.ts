export interface ResponseBody {
  code: number;
  status: string;
  payload?: any;
}

export type Callback = (response: ResponseBody) => void;

export const isEqual = (expected: ResponseBody, actual: ResponseBody) => expected.status === actual.status && expected.code === actual.code;

export const USER_AUTHENTICATED: ResponseBody = {code: 200, status: 'user-authenticated'}
export const USER_SIGNED_OUT: ResponseBody = {code: 200, status: 'user-signed-out'}

export const USER_NOT_AUTHENTICATED: ResponseBody = {code: 400, status: 'user-not-authenticated'}
export const USER_ALREADY_AUTHENTICATED: ResponseBody = {code: 400, status: 'user-already-authenticated'}
export const USER_NOT_FOUND: ResponseBody = {code: 400, status: 'invalid-username-or-password'}
export const NO_USERNAME: ResponseBody = {code: 400, status: 'no-username'}


export const QUIZ_ADDED: ResponseBody = {code: 200, status: 'quiz-added'}
export const QUIZES_FOUND: ResponseBody = {code: 200, status: 'quizes-found'}
export const QUIZ_DATA_SENT: ResponseBody = {code: 200, status: 'quiz-data-sent'}
export const QUESTION_DATA_SENT: ResponseBody = {code: 200, status: 'question-data-sent'}
export const QUIZ_STARTED: ResponseBody = {code: 200, status: 'quiz-started'}
export const QUIZ_CLOSED: ResponseBody = {code: 200, status: 'quiz-closed'}
export const ANSWER_SENT: ResponseBody = {code: 200, status: 'answer-sent'}

export const INVALID_QUIZ_ID: ResponseBody = {code: 400, status: 'invalid-quiz-id'}
export const QUIZ_ALREADY_STARTED: ResponseBody = {code: 400, status: 'quiz-already-started'}
export const NO_MORE_QUESTIONS: ResponseBody = {code: 400, status: 'no-more-questions'}
export const QUIZ_NOT_RUNNING: ResponseBody = {code: 400, status: 'quiz-not-running'}
export const INVALID_ANSWER: ResponseBody = {code: 400, status: 'invalid-answer'}


export const ROOM_OPENED: ResponseBody = {code: 200, status: 'room-opened'}
export const ROOM_JOINED: ResponseBody = {code: 200, status: 'room-joined'}
export const ROOM_CLOSED: ResponseBody = {code: 200, status: 'room-closed'}
export const USERNAME_SET: ResponseBody = {code: 200, status: 'username-set'}

export const INVALID_ROOM_ID: ResponseBody = {code: 400, status: 'invalid-room-id'}
export const INSUFFICIENT_PERMISSIONS: ResponseBody = {code: 400, status: 'insufficient-permissions'}
export const VALID_ROOM_ID: ResponseBody = {code: 400, status: 'valid-room-id'}
export const ROOM_NOT_OPEN: ResponseBody = {code: 400, status: 'room-not-open'}
export const ROOM_NOT_PAUSED: ResponseBody = {code: 400, status: 'room-not-paused'}
export const ROOM_NOT_CLOSED: ResponseBody = {code: 400, status: 'room-not-closed'}
export const USERNAME_TAKEN: ResponseBody = {code: 400, status: 'username-taken'}
