/**
 * Master process.
 * Responsibilities:
 * - get http request (with net.socket), pass to child process (room manager | player) in order to make handshake
 * - manage creation and deletion of child processes
 * - notify room managers about players joining rooms
 */

const { fork } = require('child_process');
const http = require('http');
const crypto = require('crypto');
const express = require('express');
const path = require('path');
const { createClient } = require('redis');

require('dotenv').config();

const room_manager_threads = [];
const players_manager_threads = [];
const MAX_ROOM_MANAGER_THEADS = 2,
  MAX_PLAYERS_MANAGER_THREADS = 4;

const HASH_STR = '258EAFA5-E914–47DA-95CA-C5AB0DC85B11';
function generateAcceptValue(key) {
  return crypto
    .createHash('sha1')
    .update(key + HASH_STR, 'binary')
    .digest('base64');
}

(async () => {
  // Connect to redis service
  // const publisher = createClient();

  // publisher.on('error', (err) => {
  //   console.error('Redis Client Error', err);
  // });

  // await publisher.connect();

  // // Spawn child processes
  // for (let i = 0; i < MAX_ROOM_MANAGER_THEADS; i++) {
  //   const child = fork(`${__dirname}/room_manager.js`, [i]);
  //   room_manager_threads.push(child);
  // }

  // for (let i = 0; i < MAX_PLAYERS_MANAGER_THREADS; i++) {
  //   const child = fork(`${__dirname}/players_manager.js`, [i]);
  //   players_manager_threads.push(child);
  // }

  // Create http server
  const app = express();

  const httpServer = http.createServer(app);

  app.use('/', express.static(path.join(__dirname, '..', 'public')));

  app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'), (err) => {
      if (err) {
        console.log(err);
        res.end(err.message);
      }
    });
  });

  app.get('/manage-room', (_, res) => {
    res.sendFile(
      path.join(__dirname, '..', 'public', 'manage-room.html'),
      (err) => {
        if (err) {
          console.log(err);
          res.end(err.message);
        }
      }
    );
  });

  // app.get('/socket', (req, res) => {
  //   /**
  //    * Main socket endpoint responsible for handling http upgrade requests
  //    * It accepts query parameter `type` which represents user connection type ("manager" | "player")
  //    *
  //    */

  //   if (req.headers['upgrade'] !== 'websocket')
  //     return res.socket.send('HTTP/1.1 400 Bad Request');

  //   const key = req.headers['sec-websocket-key'];
  //   const acceptKey = generateAcceptValue(key);
  //   console.log(key);
  //   const responseHeaders = [
  //     'HTTP/1.1 101 Switching Protocols',
  //     'Upgrade: websocket',
  //     'Connection: Upgrade',
  //     `Sec-WebSocket-Accept: ${acceptKey}`,
  //     `Sec-WebSocket-Extensions: ${req.headers['sec-websocket-extensions']}`,
  //   ];

  //   res.socket.on('connect', () => {
  //     console.log('Client connected');
  //   });
  //   res.socket
  //     .on('close', (hadError) => {
  //       if (hadError) console.log('Connection closed with error');
  //       else console.log('Connection closed');
  //     })
  //     .on('error', (err) => {
  //       console.log(`Connection error: ${err}`);
  //     })
  //     .on('data', (data) => {
  //       console.log(data);
  //     })
  //     .on('drain', () => {
  //       console.log('Connection drain event');
  //     });

  //   res.socket.write(responseHeaders.concat('\r\n').join('\r\n'));
  // });

  app.all('*', (_req, res) => res.status(404).json({ error: 'invalid-path' }));

  httpServer.on('upgrade', (req, socket, head) => {
    console.log(req.headers);
    socket.on('error', () => {
      console.log('error');
    });
    // const res = new http.ServerResponse(req);
    // res.assignSocket(socket);

    if (req.headers['upgrade'] !== 'websocket')
      return socket.end('HTTP/1.1 400 Bad Request');

    const key = req.headers['sec-websocket-key'];
    const acceptKey = generateAcceptValue(key);
    console.log(key);
    const responseHeaders = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${acceptKey}`,
      `Sec-WebSocket-Extensions: ${req.headers['sec-websocket-extensions']}`,
    ];

    socket.on('connect', () => {
      console.log('Client connected');
    });
    socket
      .on('close', (hadError) => {
        if (hadError) console.log('Connection closed with error');
        else console.log('Connection closed');
      })
      .on('error', (err) => {
        console.log(`Connection error: ${err}`);
      })
      .on('data', (data) => {
        console.log(data);
      })
      .on('drain', () => {
        console.log('Connection drain event');
      });
    socket.write(responseHeaders.concat('\r\n').join('\r\n'));
  });

  httpServer.listen(process.env.HOST_PORT, () => {
    console.log('HTTP Server is listening on port 8080');
  });

  // setTimeout(() => {
  //   publisher.publish('room_manager_all', 'Test message to all room_managers');
  //   publisher.publish(
  //     'players_manager_all',
  //     'Test message to all players_managers'
  //   );
  // }, 10000);
})();
