import { Server } from "socket.io";

import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SessionSocket } from "../basic";
import { Callback, ANSWER_SENT, INVALID_ANSWER, NO_USERNAME, QUIZ_NOT_RUNNING, ROOM_JOINED, INVALID_ROOM_ID, USERNAME_TAKEN, USERNAME_SET, VALID_ROOM_ID, QUIZ_ALREADY_STARTED, QUIZ_DATA_SENT } from "../../response-constants";
import { redisClient } from "../../redis";
import { QuizModel } from "../../db/models";

const isValidRoomId = async (roomId: string) => {
  const room = await redisClient.hGetAll(`${roomId}:STATE`);

  return Boolean(Object.keys(room).length);
}

const isValidUsername = async (roomId: string, username: string) => {
  const members = await redisClient.sMembers(`${roomId}:USERS`);

  return !members.includes(username);
}

const hasUsername = (socket: SessionSocket) => {
  return Boolean(socket.request.session.participant);
}

export const registerParticipantHandlers = async (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, {id: string, username: string}>) => {
  
  const nsp = io.of("/participant");

  const localPublisher = redisClient.duplicate();
  const localSubscriber = redisClient.duplicate();
  await localPublisher.connect();
  await localSubscriber.connect();

  nsp.on("connection", (socket: SessionSocket) => {
    socket.on('check-valid-room', async (roomId: string, callback: Callback) => {
      if (!(await isValidRoomId(roomId))) return callback(INVALID_ROOM_ID);
      
      return callback(VALID_ROOM_ID);
    });

    socket.on('get-quiz-data', async (roomId: string, callback: Callback) => {
      if (!(await isValidRoomId(roomId))) return callback(INVALID_ROOM_ID);

      const room = await redisClient.hGetAll(`${roomId}:STATE`);

      if (room.STATUS !== 'OPEN') return callback(QUIZ_ALREADY_STARTED);

      const quiz = await QuizModel.findById(room.QUIZ);

      return callback({...QUIZ_DATA_SENT, payload: { title: quiz.title, description: quiz.description, questionCount: quiz.questions.length }});
    });

    socket.on('join-room', async (roomId: string, username: string, callback: Callback) => {
      if (!(await isValidRoomId(roomId))) return callback(INVALID_ROOM_ID);
      if (!(await isValidUsername(roomId, username))) return callback(USERNAME_TAKEN);

      const room = await redisClient.hGetAll(`${roomId}:STATE`);

      if (room.STATUS !== 'OPEN') return callback(QUIZ_ALREADY_STARTED);

      await redisClient.sAdd(`${roomId}:USERS`, username);

      socket.join(roomId);

      socket.request.session.participant = username;

      localSubscriber.subscribe(roomId, async (message) => {
        if(message == 'room-closed') {
          socket.leave(roomId);
          socket.emit('room-closed')
        }
        if(message == 'quiz-closed') {
          const room = await redisClient.hGetAll(`${roomId}:STATE`);

          const quiz = await QuizModel.findById(room.QUIZ);

          const players = await redisClient.sMembers(`${roomId}:USERS`);

          const summary = Object.fromEntries(players.map(player => [player, 0]));

          for (let questionNumber = 0; questionNumber < quiz.questions.length; questionNumber++) {
            const answers = await redisClient.hGetAll(`${roomId}:${questionNumber}`);
            const { correctAnswer } = quiz.questions[questionNumber];

            for (let user in answers) {
              if (+answers[user] === correctAnswer) summary[user]++;
            }
            
          }
          socket.emit('quiz-closed', {summary, username: socket.request.session.participant});
        }
        if (message === 'quiz-started') {
          socket.emit('quiz-started');
        }
        if (message === 'next-question-started') {
          const room = await redisClient.hGetAll(`${roomId}:STATE`);

          const quiz = await QuizModel.findById(room.QUIZ);

          const { question, timeToAnswer, answers } = quiz.questions[+room.CURRENT_QUESTION];

          socket.emit('next-question-started', {question, timeToAnswer, answers});
        }
        if (message === 'question-closed') {
          const room = await redisClient.hGetAll(`${roomId}:STATE`);

          const quiz = await QuizModel.findById(room.QUIZ);

          const summary = [0, 0, 0, 0];

          const answers = await redisClient.hGetAll(`${roomId}:${room.CURRENT_QUESTION}`);

          for (const username in answers) {
            summary[+answers[username]]++;
          }
          
          socket.emit('question-closed', {summary, correctAnswer: quiz.questions[+room.CURRENT_QUESTION].correctAnswer});
        }
      });

      socket.on('disconnecting', async () => {
        console.log('disconnecting')
        await redisClient.sRem(`${roomId}:USERS`, username)
        const members = await redisClient.sMembers(`${roomId}:USERS`);
        localPublisher.publish(roomId, 'update-players');
        nsp.to(roomId).emit('update-player-count', members.length);
      });

      const members = await redisClient.sMembers(`${roomId}:USERS`);
      
      localPublisher.publish(roomId, 'update-players');
      nsp.to(roomId).emit('update-player-count', members.length);
      
      return callback({...ROOM_JOINED, payload: members.length});
    });

    socket.on('answer-question', async (roomId: string, answer: number, callback: Callback) => {
      if (!(await isValidRoomId(roomId))) return callback(INVALID_ROOM_ID);
      if (!hasUsername(socket)) return callback(NO_USERNAME);

      const room = await redisClient.hGetAll(`${roomId}:STATE`);

      if (room.STATUS !== 'RUNNING') return callback(QUIZ_NOT_RUNNING);

      const validAnswers = [0, 1, 2, 3];

      if (!validAnswers.includes(answer)) return callback(INVALID_ANSWER);

      await redisClient.hSet(`${roomId}:${room.CURRENT_QUESTION}`, socket.request.session.participant, answer);

      localPublisher.publish(roomId, 'update-answers');

      return callback(ANSWER_SENT);
    })
  })
}