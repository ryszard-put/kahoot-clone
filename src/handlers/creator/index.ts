import { Server } from "socket.io";
import {v4 as uuidv4} from 'uuid';

import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SessionSocket } from "../basic";
import { Callback, USER_NOT_AUTHENTICATED, QUIZ_ADDED, ROOM_OPENED, QUIZES_FOUND, INVALID_QUIZ_ID } from "../../response-constants";
import { redisClient } from "../../redis";
import { QuizModel, UserModel } from "../../db/models";

const generateRoomId = () => Math.floor(Math.random() * 1000000).toString().padStart(6, "0");

const isAuthenticated = (socket: SessionSocket) => socket.request.session.creator !== null;

export const registerCreatorHandlers = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, {id: string, username: string}>) => {
  const nsp = io.of("/creator");

  nsp.on("connection", (socket: SessionSocket) => {
    socket.on('add-quiz', async (data: string, callback: Callback) => {
      if(!isAuthenticated(socket)) callback(USER_NOT_AUTHENTICATED);

      const quizData = JSON.parse(data);

      const user = await UserModel.findById(socket.request.session.creator);
      
      const quiz = new QuizModel({ ...quizData, owner: user._id });

      user.quizes.push(quiz._id);

      await quiz.save();

      await user.save();

      return callback(QUIZ_ADDED);
    });

    socket.on('get-quizes', async (callback: Callback) => {
      if(!isAuthenticated(socket)) callback(USER_NOT_AUTHENTICATED);

      const quizes = await QuizModel.find({ owner: socket.request.session.creator });

      return callback({...QUIZES_FOUND, payload: quizes});
    });

    socket.on('open-room', async (quiz_id: string , callback: Callback) => {
      if(!isAuthenticated(socket)) callback(USER_NOT_AUTHENTICATED);

      const quiz = await QuizModel.findById(quiz_id);

      if (!quiz) return callback(INVALID_QUIZ_ID);

      const roomId = generateRoomId();

      redisClient.set(roomId, quiz_id);

      socket.join(roomId);

      return callback({...ROOM_OPENED, payload: roomId});
    });
  });
}