import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:4000`);
// app.listen(4000, handleListen);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// function handleConnection(socket) {
//   console.log(socket);
// }
// wss.on("connection", handleConnection);

// 연결해서 소켓을 알 수 있음
wss.on("connection", (socket) => {
  // console.log(socket);
  // 브라우저가 연결 되었을 때
  console.log("Connected to Browser ✅");
  // 브라우저가 꺼졌을 때
  socket.on("close", () => console.log("Disconnected from Browser ❌"));
  // 브라우저가 서버에 메세지를 보냈을 때
  socket.on("message", (message) => {
    // message만 보냈을 경우
    // <Buffer 68 65 6c 6c 6f 20 66 72 6f 6d 20 74 68 65 20 62 72 6f 77 73 65 72> 출력됨
    // toString('utf8') 인코딩해야 함
    console.log(message.toString("utf8"));
  });
  // socket으로 데이터를 보냄 (브라우저가 메세지를 보내기)
  socket.send("hello!!!");
});

server.listen(4000, handleListen);
