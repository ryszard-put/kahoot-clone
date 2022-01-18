import {config} from 'dotenv'
config();
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  transports: ['websocket'],
  path: '/ws',
  cors: {
    origin: ['http://localhost:3000'],
  },
});

io.on('connection', (socket) => {
  socket.on('disconnect', (reason) => {
    console.log(`Socket disconnected with reason: ${reason}`);
  });

  socket.on('test message', (...args) => {
    console.log(args);
  });
});

// app.use('/', express.static(path.join(__dirname, '..', 'public')));

// app.get('/', (_, res) => {
//   res.sendFile(path.join(__dirname, '..', 'public', 'index.html'), (err) => {
//     if (err) {
//       console.log(err);
//       res.end(err.message);
//     }
//   });
// });

// app.get('/manage-room', (_, res) => {
//   res.sendFile(
//     path.join(__dirname, '..', 'public', 'manage-room.html'),
//     (err) => {
//       if (err) {
//         console.log(err);
//         res.end(err.message);
//       }
//     }
//   );
// });

httpServer.listen(process.env.HOST_PORT, () => {
  console.log('Server started');
});
