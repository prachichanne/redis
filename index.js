const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const axios = require('axios');
const cors = require('cors');

app.use(cors());



io.on("connection", socket => {

  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("fetchData", () => {

    axios.get('http://localhost:5200/details')
      .then(response => {
        io.emit("data", response.data);
        console.log("data : " + JSON.stringify(response.data))

      })
      .catch((error) => {
        console.error(error);
      });

  });

  socket.on("fetchAll", () => {

    axios.get('http://localhost:5200/showAll')
      .then(response => {
        io.emit("ndata", response.data);
        console.log("ndata : " + JSON.stringify(response.data))

      })
      .catch((error) => {
        console.error(error);
      });

  });

  socket.on("deleteData", () => {

    axios.delete('http://localhost:5200/delete')
      .then(response => {
        io.emit("data", response.data);
        console.log("data : " + JSON.stringify(response.data))

      })
      .catch((error) => {
        console.error(error);
      });
  })

});

// io.on("connection", socket => {
//     console.log("A user connected");
//     socket.on("disconnect", () => {
//         console.log("A user disconnected");
//     });
//     socket.on("updateData", data => {
//         console.log("Received update:", data);
//         // broadcast the update to all connected clients
//         socket.broadcast.emit("updateData", data);
//     });
// });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.listen(5500, () => {
  console.log('Server is listening on port 5500');
});


// const express = require("express");
// const http = require("http");
// const socketio = require("socket.io");
// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);


// io.on("connection", socket => {
//   console.log("A user connected");
//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
//   socket.on("updateData", data => {
//     console.log("Received update:", data);
//     // broadcast the update to all connected clients
//     socket.broadcast.emit("updateData", data);
//   });
// });
// server.listen(3000, () => {
//   console.log("Server listening on port 3000");
// });