const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const chatController = require("../controllers/chatController");
const messageController = require("../controllers/messageController");

// User route

// Register a new user
router.post("/register", userController.signup);

// Login with Google
router.post("/login", userController.signin);
// logout
router.post("/logout", userController.logout);

// Room route

/// Get all chat rooms
router.get("/", chatController.getAllChatRooms);

// Create a chat room
router.post("/", chatController.createChatRoom);

// Join a chat room
router.post("/:roomId/join", chatController.joinChatRoom);

// Leave a chat room
router.post("/:roomId/leave", chatController.leaveChatRoom);

// Message route

// Send a message
router.post("/", messageController.sendMessage);

// Get message history for a chat room
router.get("/:chatRoomId/history", messageController.getMessageHistory);

// Send a private message
router.post("/private", messageController.sendPrivateMessage);

module.exports = router;
