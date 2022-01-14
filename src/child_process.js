// import process from 'process';
const process = require('process');

console.log(
  `Process ${process.ppid}:${process.pid}: spawned with parameters: ${process.argv[2]}`
);

process.on('beforeExit', (code) => {
  console.log(
    `Process ${process.ppid}:${process.pid} beforeExit event with code: ${code}`
  );
});

process.on('exit', (code, ...props) => {
  console.log(
    `Process ${process.ppid}:${process.pid} exit event with ${code}: `
  );
  console.log(props);
});

process.on('message', (message, sendHandle) => {
  // passed message
  if (message) {
    console.log(
      `Process ${process.ppid}:${process.pid} received message: ${message}`
    );
  }
  // passed socket
  if (sendHandle) {
    console.log(
      `Process ${process.ppid}:${process.pid} received socket object`
    );
    sendHandle.resume();
  }
});
