const chatRoomModel = require("../models/chatRoom");
const userModel = require("../models/user");
const MessageModel = require("../models/message");

// Create a new chat room
const createChatRoom = async (req, res) => {
  try {
    const { name, participants } = req.body;

    // Find participants by their user IDs
    const foundParticipants = await userModel.find({
      _id: { $in: participants },
    });

    // Create the chat room
    const chatRoom = await chatRoomModel.create({
      name,
      participants: foundParticipants,
    });

    res.status(201).json(chatRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all chat rooms
const getAllChatRooms = async (req, res) => {
  try {
    const chatRooms = await chatRoomModel
      .find()
      .populate("participants", "name");
    res.status(200).json(chatRooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Join a chat room
const joinChatRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;

    const chatRoom = await chatRoomModel.findById(roomId);
    const user = await userModel.findById(userId);

    if (!chatRoom || !user) {
      return res.status(404).json({ message: "Chat room or user not found" });
    }

    chatRoom.participants.push(user);
    await chatRoom.save();

    res.status(200).json(chatRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Leave a chat room
const leaveChatRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;

    const chatRoom = await chatRoomModel.findById(roomId);
    const user = await userModel.findById(userId);

    if (!chatRoom || !user) {
      return res.status(404).json({ message: "Chat room or user not found" });
    }

    const index = chatRoom.participants.indexOf(user._id);
    if (index !== -1) {
      chatRoom.participants.splice(index, 1);
    }

    await chatRoom.save();

    res.status(200).json({ message: "Successfully left the chat room" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createChatRoom,
  getAllChatRooms,
  joinChatRoom,
  leaveChatRoom,
};
