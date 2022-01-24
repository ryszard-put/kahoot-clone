import { Server } from "socket.io";
import {v4 as uuidv4} from 'uuid';

import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SessionSocket } from "../basic";
import { Callback, USER_NOT_AUTHENTICATED, ROOM_CLOSED, ROOM_NOT_CLOSED, QUIZ_ADDED, QUIZ_STARTED, ROOM_NOT_PAUSED, ROOM_OPENED, QUIZES_FOUND, INVALID_QUIZ_ID, INSUFFICIENT_PERMISSIONS, NO_MORE_QUESTIONS, QUESTION_DATA_SENT, ROOM_NOT_OPEN, QUIZ_CLOSED } from "../../response-constants";
import { redisClient } from "../../redis";
import { QuizModel, UserModel } from "../../db/models";

const generateRoomId = async (size: number = 6) => {
  let roomId = Math.floor(Math.random() * (10 ** size)).toString().padStart(6, "0");
  let room = await redisClient.hGetAll(`${roomId}:STATE`);

  while (Object.keys(room).length) {
    roomId = Math.floor(Math.random() * (10 ** size)).toString().padStart(6, "0");
    room = await redisClient.hGetAll(`${roomId}:STATE`);
  }

  return roomId;
}

const isValidQuizId = async (quizId: string) => {
  const quiz = await QuizModel.findById(quizId);

  return Boolean(quiz);
}

const isInRoom = async (socket: SessionSocket) => {
  return socket.rooms.size > 1;
}

const isOwner = async (socket: SessionSocket, roomId: string) => {
  const room = await redisClient.hGetAll(`${roomId}:STATE`);

  return room.OWNER === socket.request.session.creator;
}

const isStatus = async (roomId: string, status: string) => {
  const room = await redisClient.hGetAll(`${roomId}:STATE`);

  return room.STATUS === status;
}

const isAuthenticated = (socket: SessionSocket) => socket.request.session.creator !== null;

export const registerCreatorHandlers = async (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, {id: string, username: string}>) => {

  const nsp = io.of("/creator");

  const localPublisher = redisClient.duplicate();
  const localSubscriber = redisClient.duplicate();
  await localPublisher.connect();
  await localSubscriber.connect();

  nsp.on("connection", (socket: SessionSocket) => {

    socket.on('add-quiz', async (data: string, callback: Callback) => {
      if (!isAuthenticated(socket)) callback(USER_NOT_AUTHENTICATED);

      // get the data about quiz
      const quizData = JSON.parse(data);

      // get the currently authenticated user
      const user = await UserModel.findById(socket.request.session.creator);
      
      // create a new quiz
      const quiz = new QuizModel({ ...quizData, owner: user._id });

      // assign the quiz to its creator
      user.quizes.push(quiz._id);

      // save the new quiz to database
      await quiz.save();
      await user.save();

      // respond with a success message
      return callback(QUIZ_ADDED);
    });

    socket.on('get-quizes', async (callback: Callback) => {
      if (!isAuthenticated(socket)) return callback(USER_NOT_AUTHENTICATED);

      // find all quizes belonging to the currently authenticated user
      const quizes = await QuizModel.find({ owner: socket.request.session.creator });

      // respond with a success message and a list of found quizes
      return callback({ ...QUIZES_FOUND, payload: quizes });
    });

    socket.on('open-room', async (quizId: string, callback: Callback) => {
      if (!isAuthenticated(socket)) return callback(USER_NOT_AUTHENTICATED);
      if (!(await isValidQuizId(quizId))) return callback(INVALID_QUIZ_ID);
      
      // generate random unused room id
      const roomId = await generateRoomId();

      // add data about the quiz state to the temporary database
      await redisClient.hSet(`${roomId}:STATE`, 'STATUS', 'OPEN');
      await redisClient.hSet(`${roomId}:STATE`, 'QUIZ', quizId);
      await redisClient.hSet(`${roomId}:STATE`, 'OWNER', socket.request.session.creator);
      await redisClient.hSet(`${roomId}:STATE`, 'CURRENT_QUESTION', -1);

      // join to the current quiz room
      socket.join(roomId);
      
      // respond to the published events
      localSubscriber.subscribe(roomId, async (message) => {
        if (message === 'update-players') {
          const players = await redisClient.sMembers(`${roomId}:USERS`);
          socket.emit('update-players', players);
        }
        if (message === 'update-answers') {
          const room = await redisClient.hGetAll(`${roomId}:STATE`);

          const quiz = await QuizModel.findById(room.QUIZ);

          const summary = [0, 0, 0, 0];

          const answers = await redisClient.hGetAll(`${roomId}:${room.CURRENT_QUESTION}`);

          for (const username in answers) {
            summary[+answers[username]]++;
          }
          socket.emit('update-answers', summary, +room.CURRENT_QUESTION);
        }
      });

      // if the socket gets disconnected while the room is still active
      socket.on('disconnecting', async () => {
        // remove the data about the quiz from the temporary database
        console.log(roomId);
        const x = await redisClient.del(`${roomId}:*`);
        // const y = await redisClient.del(`${roomId}:STATE`);
        console.log(x);
        // publish an information intended for participants that the room has closed
        localPublisher.publish(roomId, 'room-closed');
      });

      // respond with a success message and the newly created room id
      return callback({ ...ROOM_OPENED, payload: roomId });
    });

    socket.on('start-quiz', async (roomId: string, callback: Callback) => {
      if (!isAuthenticated(socket)) return callback(USER_NOT_AUTHENTICATED);
      if (!(await isOwner(socket, roomId))) return callback(INSUFFICIENT_PERMISSIONS);
      if (!(await isStatus(roomId, 'OPEN'))) return callback(ROOM_NOT_OPEN);
      
      // initial quiz state is PAUSED (question is not displayed)
      await redisClient.hSet(`${roomId}:STATE`, 'STATUS', 'PAUSED');

      // find the room state
      const room = await redisClient.hGetAll(`${roomId}:STATE`);

      // find the quiz that is active in current room
      const quiz = await QuizModel.findById(room.QUIZ);

      // publish an information for participants that the quiz has started
      localPublisher.publish(roomId, 'quiz-started');

      // respond with a success message and the found questions
      return callback({ ...QUIZ_STARTED, payload: quiz.questions });
    });

    socket.on('start-next-question', async (roomId: string, callback: Callback) => {
      if (!isAuthenticated(socket)) return callback(USER_NOT_AUTHENTICATED);
      if (!(await isOwner(socket, roomId))) return callback(INSUFFICIENT_PERMISSIONS);
      if (!(await isStatus(roomId, 'PAUSED'))) return callback(ROOM_NOT_PAUSED);

      await redisClient.hSet(`${roomId}:STATE`, 'STATUS', 'RUNNING');

      const room = await redisClient.hGetAll(`${roomId}:STATE`);

      const quiz = await QuizModel.findById(room.QUIZ);

      const nextQuestionNumber = +room.CURRENT_QUESTION + 1;

      if (nextQuestionNumber >= quiz.questions.length) return callback(NO_MORE_QUESTIONS);

      await redisClient.hSet(`${roomId}:STATE`, 'CURRENT_QUESTION', nextQuestionNumber);

      const { timeToAnswer } = quiz.questions[nextQuestionNumber];

      localPublisher.publish(roomId, 'next-question-started');

      setTimeout(async () => {
        
        await redisClient.hSet(`${roomId}:STATE`, 'STATUS', 'PAUSED');

        socket.emit('question-closed');

        localPublisher.publish(roomId, 'question-closed');

      }, +timeToAnswer * 1000);

      return callback({ ...QUESTION_DATA_SENT, payload: +timeToAnswer });
    });

    socket.on('close-quiz', async (roomId: string, callback: Callback) => {
      if (!isAuthenticated(socket)) return callback(USER_NOT_AUTHENTICATED);
      if (!(await isOwner(socket, roomId))) return callback(INSUFFICIENT_PERMISSIONS);
      if (!(await isStatus(roomId, 'PAUSED'))) return callback(ROOM_NOT_PAUSED);
      
      await redisClient.hSet(`${roomId}:STATE`, 'STATUS', 'CLOSED');

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

      localPublisher.publish(roomId, 'quiz-closed');

      return callback({ ...QUIZ_CLOSED, payload: summary });
    });

    socket.on('close-room', async (roomId: string, callback: Callback) => {
      if (!isAuthenticated(socket)) return callback(USER_NOT_AUTHENTICATED);
      if (!(await isOwner(socket, roomId))) return callback(INSUFFICIENT_PERMISSIONS);
      if (!(await isStatus(roomId, 'CLOSED'))) return callback(ROOM_NOT_CLOSED);
      await redisClient.del(`${roomId}:*`);

      localPublisher.publish(roomId, 'room-closed');

      return callback(ROOM_CLOSED);
    });
  });
}