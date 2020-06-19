const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const axios = require("axios");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const api_address = "http://localhost:5004/email/api";
app.use(cors());
app.use(router);
let messages = [];
io.on("connect", (socket) => {
  socket.on("join", ({ name, room, client_id, customer_id }, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      name,
      room,
      client_id,
      customer_id,
    });

    if (error) return callback(error);
    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    console.log(user.room);
    const headers = {
      "Content-Type": "application/json",
    };
    const response = axios
      .post(
        api_address + "/get_chat_history",
        {
          room: user.room,
        },
        { headers: headers, rejectUnauthorized: false }
      )
      .then((response) => {
        io.to(user.room).emit("old_messsages", {
          messages: response.data.messages,
        });
        callback();
      })
      .catch((err) => {
        callback();
      });
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    console.log("user : ", user, socket.id);
    if (user) {
      messages.push({
        user: user.name,
        text: message,
        room: user.room,
        customer_id: user.customer_id,
      });
      console.log("user.customer_id", user.customer_id);
      const headers = {
        "Content-Type": "application/json",
      };
      const response = axios
        .post(
          api_address + "/save_chat_messages",
          {
            user: user.name,
            room: user.room,
            customer: user.name,
            client: user.client_id,
            text: message,
            customer_id: user.customer_id,
          },
          { headers: headers }
        )
        .then((response) => {})
        .catch((err) => {});
      io.to(user.room).emit("message", { user: user.name, text: message });
      callback();
    } else {
      callback("user cannot found");
    }
  });
  socket.on("typing", (message, callback) => {
    const user = getUser(socket.id);

    if (user) {
      io.to(user.room).emit("typing", {
        user: user.name,
        text: "typing message",
      });
      callback();
    }
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(process.env.PORT || 5005, () =>
  console.log(`Server has started.`)
);
