const process = require('process');
const { createClient } = require('redis');

(async () => {
  console.log(
    `room_manager thread #${process.argv[2]} ${process.ppid}:${process.pid} spawned`
  );

  const subscriber = createClient();

  subscriber.on('error', (err) => {
    console.error('Redis Client Error', err);
  });

  await subscriber.connect();

  subscriber.subscribe('room_manager_all', (message) => {
    console.log(
      `room-manager-${process.argv[2]} message received from room_manager_all channel: ${message}`
    );
  });
})();
