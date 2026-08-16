# Smart Lamp — Dashboard

This project provides a simple Node.js server and frontend dashboard to display LDR readings sent from an ESP8266 over WebSocket.

Files:
- `server.js` — Express static server + WebSocket relay
- `public/` — Frontend files (`index.html`, `styles.css`, `app.js`)

Setup

1. Install Node.js (14+).
2. From the project folder run:

```bash
npm install
npm start
```

The dashboard will be available at `http://localhost:3000`.

Arduino (ESP8266) example

Install the `arduinoWebSockets` library and use this sketch (edit SSID/PASS and server IP):

```cpp
#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASS";
const char* serverIp = "192.168.1.100"; // set your PC/server IP

WebSocketsClient webSocket;

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  // handle events if needed
}

void setup(){
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  webSocket.begin(serverIp, 3000, "/ws?role=arduino");
  webSocket.onEvent(webSocketEvent);
}

void loop(){
  webSocket.loop();
  int ldr = analogRead(A0);
  char buf[64];
  snprintf(buf, sizeof(buf), "{\"ldr\":%d}", ldr);
  webSocket.sendTXT(buf);
  delay(1000);
}
```

Notes
- The example assumes the server runs on the same LAN. Replace `serverIp` with your machine's IP.
- If you prefer to use HTTP POST or MQTT instead of WebSocket, I can provide examples.
