import { Server } from "socket.io";
import {v4 as uuidv4} from 'uuid';

import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SessionSocket } from "../basic";
import { Callback, ROOM_JOINED, INVALID_ROOM_ID, USERNAME_TAKEN, USERNAME_SET } from "../../response-constants";
import { redisClient } from "../../redis";
import { QuizModel } from "../../db/models";


export const registerParticipantHandlers = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, {id: string, username: string}>) => {
  const nsp = io.of("/participant");

  nsp.on("connection", (socket: SessionSocket) => {
    socket.on('join-room', async (room_id: string, callback: Callback) => {

      const quiz_id = await redisClient.get(room_id);

      if (!quiz_id) return callback(INVALID_ROOM_ID);

      const quiz = await QuizModel.findById(quiz_id);

      socket.join(room_id);

      socket.data.room_id = room_id;

      io.of('/creator').to(room_id).emit('player-connected');

      return callback({...ROOM_JOINED, payload: { title: quiz.title, description: quiz.description }});
    });

    socket.on('set-username', async (username: string, callback: Callback) => {

      if (false) return callback(USERNAME_TAKEN);

      socket.data.username = username;

      io.of('/creator').to(socket.data.room_id).emit('player-ready', username);
      
      return callback(USERNAME_SET);
    });
  });
}