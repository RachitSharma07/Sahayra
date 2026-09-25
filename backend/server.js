const dns = require("dns");

dns.setServers(["8.8.8.8"]);

require("dotenv").config();

const http = require("http");

const app = require("./src/app");

const connectDB = require("./src/config/db");

const { Server } = require("socket.io");

const jwt = require("jsonwebtoken");

const Message = require("./src/models/Message");

const User = require("./src/models/User");

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

/*
 * Socket.IO
 */
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

/*
 * userId -> Set(socketId)
 *
 * Example:
 *
 * User A
 *   -> socket1
 *   -> socket2
 *
 * This allows multiple tabs/devices.
 */
const onlineUserSockets = new Map();

/*
 * Get all online User IDs.
 */
const getOnlineUsers = () => {
  return Array.from(onlineUserSockets.keys());
};

/*
 * Send updated presence to everyone.
 */
const broadcastOnlineUsers = () => {
  io.emit("onlineUsers", getOnlineUsers());
};

/*
 * Socket connection
 */
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  /*
   * Get JWT
   */
  const token = socket.handshake.auth?.token;

  if (!token) {
    console.error("Socket authentication failed: token missing");

    socket.disconnect();

    return;
  }

  /*
   * Authenticate socket
   */
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.userId = decoded.userId.toString();

    console.log("Socket authenticated:", socket.userId);
  } catch (error) {
    console.error("Socket authentication failed:", error.message);

    socket.disconnect();

    return;
  }

  /*
   * Join private room.
   *
   * Room name = User ID
   */
  socket.join(socket.userId);

  /*
   * Register socket for online presence.
   */
  if (!onlineUserSockets.has(socket.userId)) {
    onlineUserSockets.set(socket.userId, new Set());
  }

  onlineUserSockets.get(socket.userId).add(socket.id);

  /*
   * Send current online users
   * to the newly connected user.
   */
  socket.emit("onlineUsers", getOnlineUsers());

  /*
   * Broadcast updated online list.
   */
  broadcastOnlineUsers();

  /*
   * Client requests latest presence.
   */
  socket.on("requestOnlineUsers", () => {
    socket.emit("onlineUsers", getOnlineUsers());
  });

  /*
   * =====================================
   * SEND MESSAGE
   * =====================================
   */
  socket.on("sendMessage", async (data, callback) => {
    try {
      const receiverId = data?.receiver?.toString();

      const messageText = data?.message?.trim();

      /*
       * Validate input.
       */
      if (!receiverId || !messageText) {
        if (callback) {
          callback({
            success: false,
            message: "Receiver and message are required",
          });
        }

        return;
      }

      /*
       * Make sure receiver exists.
       */
      const receiverUser = await User.findById(receiverId).select(
        "_id name email role",
      );

      if (!receiverUser) {
        if (callback) {
          callback({
            success: false,
            message: "Receiver user not found",
          });
        }

        return;
      }

      /*
       * Find sender.
       *
       * This gives us the REAL sender name.
       */
      const senderUser = await User.findById(socket.userId).select(
        "_id name email role",
      );

      if (!senderUser) {
        if (callback) {
          callback({
            success: false,
            message: "Sender user not found",
          });
        }

        return;
      }

      /*
       * Save message in MongoDB.
       */
      const savedMessage = await Message.create({
        sender: socket.userId,

        receiver: receiverId,

        message: messageText,
      });

      /*
       * IMPORTANT:
       *
       * Keep sender and receiver
       * as string IDs for frontend
       * comparison.
       *
       * Add senderName so the receiver
       * can display the actual sender.
       */
      const messagePayload = {
        _id: savedMessage._id.toString(),

        sender: savedMessage.sender.toString(),

        senderName: senderUser.name,

        senderRole: senderUser.role,

        receiver: savedMessage.receiver.toString(),

        receiverName: receiverUser.name,

        receiverRole: receiverUser.role,

        message: savedMessage.message,

        createdAt: savedMessage.createdAt,

        updatedAt: savedMessage.updatedAt,
      };

      console.log("================ MESSAGE ================");

      console.log("Sender ID:", messagePayload.sender);

      console.log("Sender Name:", messagePayload.senderName);

      console.log("Receiver ID:", messagePayload.receiver);

      console.log("Receiver Name:", messagePayload.receiverName);

      console.log("Message:", messagePayload.message);

      /*
       * =====================================
       * SEND TO RECEIVER
       * =====================================
       *
       * Sends to every active socket
       * of the receiver.
       */
      const receiverSockets = onlineUserSockets.get(receiverId);

      if (receiverSockets && receiverSockets.size > 0) {
        receiverSockets.forEach((socketId) => {
          io.to(socketId).emit("receiveMessage", messagePayload);
        });

        console.log(
          "Delivered to receiver sockets:",
          Array.from(receiverSockets),
        );
      } else {
        console.log("Receiver is currently offline:", receiverId);
      }

      /*
       * =====================================
       * SEND TO SENDER
       * =====================================
       *
       * Send to all sender sockets.
       *
       * Chat frontend will prevent
       * duplicate messages if multiple
       * events are received.
       */
      const senderSockets = onlineUserSockets.get(socket.userId);

      if (senderSockets && senderSockets.size > 0) {
        senderSockets.forEach((socketId) => {
          io.to(socketId).emit("receiveMessage", messagePayload);
        });
      }

      /*
       * Acknowledge successful save.
       */
      if (callback) {
        callback({
          success: true,

          message: messagePayload,
        });
      }

      console.log("==========================================");
    } catch (error) {
      console.error("Failed to send message:", error);

      if (callback) {
        callback({
          success: false,
          message: "Failed to send message",
        });
      }
    }
  });

  /*
   * =====================================
   * TYPING
   * =====================================
   */
  socket.on("typing", (receiverId) => {
    if (!receiverId) {
      return;
    }

    const receiverSockets = onlineUserSockets.get(receiverId.toString());

    if (!receiverSockets) {
      return;
    }

    receiverSockets.forEach((socketId) => {
      io.to(socketId).emit("userTyping", socket.userId);
    });
  });

  /*
   * =====================================
   * STOP TYPING
   * =====================================
   */
  socket.on("stopTyping", (receiverId) => {
    if (!receiverId) {
      return;
    }

    const receiverSockets = onlineUserSockets.get(receiverId.toString());

    if (!receiverSockets) {
      return;
    }

    receiverSockets.forEach((socketId) => {
      io.to(socketId).emit("userStoppedTyping", socket.userId);
    });
  });

  /*
   * =====================================
   * DISCONNECT
   * =====================================
   */
  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, reason);

    const userSockets = onlineUserSockets.get(socket.userId);

    if (!userSockets) {
      return;
    }

    /*
     * Remove this particular socket.
     */
    userSockets.delete(socket.id);

    /*
     * User is offline only when
     * their last socket disconnects.
     */
    if (userSockets.size === 0) {
      onlineUserSockets.delete(socket.userId);
    }

    /*
     * Broadcast new presence.
     */
    broadcastOnlineUsers();
  });
});

/*
 * Start server
 */
server.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
