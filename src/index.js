const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/routes");
const server = require("http").createServer(app);
const io = require("socket.io")(server);

require("dotenv").config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", route);
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: "true",
    useUnifiedTopology: "true",
  })

  .then(() => console.log("mongodb is connected"))
  .catch((err) => console.log(err));

// Socket.IO event handlers
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle chat room join event
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Handle chat message event
  socket.on("chatMessage", (roomId, message) => {
    io.to(roomId).emit("message", message);
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
