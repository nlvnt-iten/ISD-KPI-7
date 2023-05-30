const WebSocket = require('ws');

// Значення ІПН у відповідності до кількості цукру та жому
const ipnValues = {
  '1234567890': { sugar: 10, bagasse: 5 },
  '9876543210': { sugar: 20, bagasse: 10 },
  '5555555555': { sugar: 30, bagasse: 15 }
};

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const ipn = message;
    const ipnData = ipnValues[ipn];

    if (ipnData) {
      const { sugar, bagasse } = ipnData;
      const time = getCurrentTime();

      const responseData = {
        time: time,
        ipn: ipn.toString(),
        sugar: sugar,
        bagasse: bagasse
      };
      ws.send(JSON.stringify(responseData));
    } else {
      const errorResponse = {
        time: getCurrentTime(),
        error: 'Невірний ІПН'
      };
      ws.send(JSON.stringify(errorResponse));
    }
  });
});

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
