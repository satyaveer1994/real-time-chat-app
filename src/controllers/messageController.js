const chatRoomModel = require("../models/chatRoom");
const userModel = require("../models/user");
const messageModel = require("../models/message");
const io = require("socket.io")(server);
// Send a message
const sendMessage = async (req, res) => {
  try {
    const { content, senderId, recipientId, chatRoomId } = req.body;

    const sender = await userModel.findById(senderId);
    const recipient = await userModel.findById(recipientId);
    const chatRoom = await chatRoomModel.findById(chatRoomId);

    if (!sender || !chatRoom) {
      return res.status(404).json({ message: "Sender or chat room not found" });
    }

    let message;
    if (recipient) {
      message = await messageModel.create({
        content,
        sender,
        recipient,
        chatRoom,
      });
    } else {
      message = await messageModel.create({ content, sender, chatRoom });
    }

    // Save the message to the chat room's message history
    chatRoom.messages.push(message);
    await chatRoom.save();

    // Emit the new message to all participants in the chat room
    io.to(chatRoomId).emit("newMessage", message);

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send a private message
const sendPrivateMessage = async (req, res) => {
  try {
    const { content, senderId, recipientId } = req.body;

    const sender = await userModel.findById(senderId);
    const recipient = await userModel.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).json({ message: "Sender or recipient not found" });
    }

    // Create a new chat room for the private conversation
    const chatRoom = await chatRoomModel.create({
      name: "Private Chat",
      participants: [sender, recipient],
    });

    // Create the private message
    const message = await messageModel.create({
      content,
      sender,
      recipient,
      chatRoom,
      isPrivate: true,
    });

    // Emit the new message to the recipient and sender
    io.to(recipientId).to(senderId).emit("newMessage", message);

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get message history for a chat room
const getMessageHistory = async (req, res) => {
  try {
    const { chatRoomId } = req.params;

    const chatRoom = await chatRoomModel
      .findById(chatRoomId)
      .populate("messages");

    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    res.status(200).json(chatRoom.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { sendMessage, sendPrivateMessage, getMessageHistory };
