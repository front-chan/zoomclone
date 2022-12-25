// alert("hello!");
// console.log("hello");

// 새로고침할 때 작동함
const socket = new WebSocket(`ws://${window.location.host}`);

// function fu(event) {
// }
// btn.addEventListener('click', fn)

// socket이 connection을 open 했을 때 발생하는 event
socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

// 서버로부터 메시지를 받을 때 message 출력
socket.addEventListener("message", (message) => {
  console.log("New message: ", message.data);
});

// server와 연결이 끊어졌을 때
socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

// FE > BE로 메세지 보내기
// 1. 메시지 보내기
// 즉시 실행되길 원하지 않기 때문에 timeout을 사용함
setTimeout(() => {
  socket.send("hello from the browser");
}, 10000);
