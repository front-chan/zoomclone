import http from "http";
// import WebSocket from "ws";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:4000`);
// app.listen(4000, handleListen);

const httpServer = http.createServer(app);
// const wss = new WebSocket.Server({ server });
const wsServer = SocketIO(httpServer);

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  // const sids = wsServer.sockets.adapter.sids;
  // const rooms = wsServer.sockets.adapter.rooms;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  // console.log(socket);
  socket.onAny((event) => {
    console.log(wsServer.sockets.adapter);
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    // console.log(roomName);
    // console.log(socket.id)
    // console.log(socket.rooms);
    socket.join(roomName);
    done();
    // console.log(socket.rooms);
    // setTimeout(() => {
    //   done("hello from the backend");
    // }, 15000);
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

// function handleConnection(socket) {
//   console.log(socket);
// }
// wss.on("connection", handleConnection);

/*
// 누군가 우리 서버에 연결하면 connection을 넣을 변수
const sockets = [];

// 연결해서 소켓을 알 수 있음
wss.on("connection", (socket) => {
  // 다른 곳에서 연결되었을 때 다른곳의 socket을 sockets array에 넣어줌
  sockets.push(socket);
  // 익명일 경우
  socket["nickname"] = "Anon";
  // console.log(socket);
  // 브라우저가 연결 되었을 때 (채팅방에 들어갔을 때 - 버튼을 누르는 것)
  console.log("Connected to Browser ✅");
  // 브라우저가 꺼졌을 때
  socket.on("close", () => console.log("Disconnected from Browser ❌"));
  // 브라우저가 서버에 메세지를 보냈을 때
  socket.on("message", (msg) => {
    // console.log(message.toString("utf8"));
    const message = JSON.parse(msg);
    // console.log(parsed, message.toString("utf8"));
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
        break;
      case "nickname":
        // console.log(message.payload);
        socket["nickname"] = message.payload;
        break;
    }


    if (parsed.type === "new_message") {
      // 각 브라우저를 aSocket으로 표시하고 메세지를 보낸다는 의미
      // sockets.forEach((aSocket) => aSocket.send(message.toString("utf8")));
      sockets.forEach((aSocket) => aSocket.send(parsed.payload));
    } else if (parsed.type === "nickname") {
      console.log(parsed.payload);
    }
  

    // message만 보냈을 경우
    // <Buffer 68 65 6c 6c 6f 20 66 72 6f 6d 20 74 68 65 20 62 72 6f 77 73 65 72> 출력됨
    // toString('utf8') 인코딩해야 함
    // console.log(message.toString("utf8"));

    // FE에서 BE로 보낸 메세지를 다시 보내줌
    // socket.send(message.toString("utf8"));
  });
  // socket으로 데이터를 보냄 (브라우저에 메세지를 보내기)
  //   socket.send("hello!!!");
});
*/

httpServer.listen(4000, handleListen);

// {
//     type: 'message',
//     payload: "hello everyone!"
// }

// {
//     type: "nickname",
//     payload: "chan"
// }
