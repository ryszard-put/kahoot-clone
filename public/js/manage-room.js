const fileInput = document.querySelector('#file_input');
try {
  const wsConnection = new WebSocket(
    `ws://${location.host}/socket?type=manage-room`
  );

  wsConnection.addEventListener('open', function (event) {
    console.log('Połączono z socketem');
    this.send('Hello from client');
  });

  wsConnection.addEventListener('error', function (event) {
    console.log(event);
    console.log('Błąd przy łączeniu z socketem');
  });

  wsConnection.addEventListener('message', function (event) {
    console.log(`Wiadomosc z serwera: ${event.data}`);
  });

  wsConnection.addEventListener('close', function (event) {
    console.log('Rozłączono połączenie z socketem');
  });
} catch (exc) {
  console.log(exc);
}

fileInput.addEventListener('change', function (event) {
  if (this.files.length != 1) return alert('Blad przeslania pliku');
  const file = this.files[0];

  const reader = new FileReader();
  reader.onload = function (event) {
    console.log(event.target.result);
    const obj = JSON.parse(event.target.result);
    console.log(obj);
  };

  reader.readAsText(file);
});
