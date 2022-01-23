import {config} from 'dotenv'
config();
import express from 'express';
import http from 'http';
import session from 'express-session';
import { Server, Socket } from 'socket.io';
import { registerBasicHandlers } from './handlers/basic';
import { registerCreatorHandlers } from './handlers/creator';
import { registerParticipantHandlers } from './handlers/participant';
import { connectDB, loadDB } from './db';
import { initRedis } from './redis';

const wrap = (middleware: any) => (socket: Socket, next: any) => middleware(socket.request, {}, next);

(async () => {
  await initRedis();

  await connectDB();
  await loadDB();

  const app = express();
  const httpServer = http.createServer(app);
  
  const io = new Server(httpServer, {
    transports: ['websocket'],
    path: '/ws',
    cors: {
      origin: 'http://localhost:3000',
      credentials: true
    },
  });
  io.use(wrap(session({ secret: process.env.SESSION_SECRET })));

  registerBasicHandlers(io);
  registerCreatorHandlers(io);
  registerParticipantHandlers(io);

  httpServer.listen(process.env.HOST_PORT, () => {
    console.log('Server started');
  });
})();
