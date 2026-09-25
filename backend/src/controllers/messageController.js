const Message = require("../models/Message");
const User = require("../models/User");

const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const currentUserId = req.user.userId;

    /*
     * Find the person we are chatting with.
     */
    const chatUser = await User.findById(userId).select("_id name email role");

    if (!chatUser) {
      return res.status(404).json({
        message: "Chat user not found",
      });
    }

    /*
     * Fetch conversation history.
     *
     * Populate both sender and receiver
     * so the frontend knows the actual
     * name of the person sending each message.
     */
    const messages = await Message.find({
      $or: [
        {
          sender: currentUserId,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: currentUserId,
        },
      ],
    })
      .populate("sender", "_id name role")
      .populate("receiver", "_id name role")
      .sort({
        createdAt: 1,
      });

    return res.status(200).json({
      message: "Messages fetched successfully",

      /*
       * Person being chatted with.
       */
      chatUser: {
        _id: chatUser._id,
        name: chatUser.name,
        email: chatUser.email,
        role: chatUser.role,
      },

      /*
       * Full conversation.
       */
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};

module.exports = {
  getMessages,
};
