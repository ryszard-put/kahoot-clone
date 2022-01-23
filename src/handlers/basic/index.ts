import { Server, Socket } from "socket.io";
import {v4 as uuidv4} from 'uuid';
import { UserModel } from "../../db/models";
import {IncomingMessage} from 'http';
import { SessionData } from "express-session";
import { USER_AUTHENTICATED, USER_NOT_FOUND, USER_ALREADY_AUTHENTICATED, USER_NOT_AUTHENTICATED, USER_SIGNED_OUT, Callback } from "../../response-constants";

export interface SocketSessionData extends SessionData {
  creator?: string;
  participant?: string;
}

export interface SessionIncomingMessage extends IncomingMessage {
  session: SocketSessionData
}

export interface SessionSocket extends Socket {
    request: SessionIncomingMessage
};

export const registerBasicHandlers = (io: Server) => {

  io.on("connection", (socket: SessionSocket) => {

    socket.on('signin', async (data: {username: string, password: string}, callback: Callback) => {

      if (socket.request.session.creator) return callback(USER_ALREADY_AUTHENTICATED)

      const user = await UserModel.findOne({username: data.username});

      if (!user || !user.validatePassword(data.password)) return callback(USER_NOT_FOUND);

      socket.request.session.creator = user._id;
      return callback(USER_AUTHENTICATED);
    });

    socket.on('signout', (callback: Callback) => {

      if(!socket.request.session.creator) return callback(USER_NOT_AUTHENTICATED);

      socket.request.session.creator = null;

      return callback(USER_SIGNED_OUT);
    })
    
    socket.on('test-session', async () => {
      console.log(socket.request.session);
    })
  })
}