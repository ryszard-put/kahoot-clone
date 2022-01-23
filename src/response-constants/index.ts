export interface ResponseBody {
  code: number;
  status: string;
  payload?: any;
}

export type Callback = (response: ResponseBody) => void;

export const USER_NOT_AUTHENTICATED: ResponseBody = {code: 400, status: 'user-not-authenticated'}
export const USER_ALREADY_AUTHENTICATED: ResponseBody = {code: 400, status: 'user-already-authenticated'}
export const USER_NOT_FOUND: ResponseBody = {code: 400, status: 'invalid-username-or-password'}

export const USER_AUTHENTICATED: ResponseBody = {code: 200, status: 'user-authenticated'}
export const USER_SIGNED_OUT: ResponseBody = {code: 200, status: 'user-signed-out'}


export const QUIZ_ADDED: ResponseBody = {code: 200, status: 'quiz-added'}
export const QUIZES_FOUND: ResponseBody = {code: 200, status: 'quizes-found'}

export const INVALID_QUIZ_ID: ResponseBody = {code: 400, status: 'invalid-quiz-id'}

export const ROOM_OPENED: ResponseBody = {code: 200, status: 'room-opened'}
export const ROOM_JOINED: ResponseBody = {code: 200, status: 'room-joined'}
export const USERNAME_SET: ResponseBody = {code: 200, status: 'username-set'}


export const INVALID_ROOM_ID: ResponseBody = {code: 400, status: 'invalid-room-id'}
export const USERNAME_TAKEN: ResponseBody = {code: 400, status: 'username-taken'}