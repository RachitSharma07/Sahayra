import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

/* =========================================================
   ICONS
========================================================= */

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 3 10.5 13.5" />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 3-6.7 18-3.8-7.5L3 9.7 21 3Z"
      />
    </svg>
  );
}

function MessageCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-7 w-7"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 11.5a8 8 0 0 1-8.4 8 8.8 8.8 0 0 1-3.5-.8L4 20l1.3-3.5A7.9 7.9 0 0 1 4 11.5a8 8 0 0 1 8-8 8 8 0 0 1 8 8Z"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.5 19 6v5.2c0 4.3-2.8 7.7-7 9.3-4.2-1.6-7-5-7-9.3V6l7-2.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.2 12 1.8 1.8 3.8-4"
      />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 9.5a11 11 0 0 1 14 0"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 13a6.5 6.5 0 0 1 8 0"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.8 16.2a2 2 0 0 1 2.4 0"
      />

      <circle cx="12" cy="19" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* =========================================================
   CHAT
========================================================= */

function Chat() {
  const { userId } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    socket,
    socketConnected,
    onlineUsers,
    latestMessage,
    currentUserId: socketUserId,
    reconnectSocket,
  } = useSocket();

  /*
   * Current logged-in User ID.
   */
  const currentUserId = socketUserId || user?.id || user?._id || user?.userId;

  /*
   * State
   */
  const [messages, setMessages] = useState([]);

  const [chatUser, setChatUser] = useState(null);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const typingTimeoutRef = useRef(null);

  /*
   * Normalize ID.
   */
  const normalizeId = (value) => {
    if (!value) {
      return "";
    }

    if (typeof value === "object" && value._id) {
      return value._id.toString();
    }

    return value.toString();
  };

  /*
   * Current user ID.
   */
  const myId = normalizeId(currentUserId);

  /*
   * Chat partner User ID.
   */
  const otherUserId = normalizeId(userId);

  /*
   * Fetch chat history.
   */
  const fetchMessages = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch messages");
      }

      setMessages(data.messages || []);

      setChatUser(data.chatUser || null);
    } catch (error) {
      console.error("Fetch messages error:", error);

      setError(error.message || "Failed to load conversation.");
    }
  }, [userId, navigate]);

  /*
   * Initial chat history.
   */
  useEffect(() => {
    setLoading(true);
    setError("");
    setMessages([]);
    setChatUser(null);

    const loadConversation = async () => {
      await fetchMessages();
      setLoading(false);
    };

    loadConversation();
  }, [fetchMessages]);

  /*
   * =================================================
   * LIVE MESSAGE
   * =================================================
   */
  useEffect(() => {
    if (!latestMessage || !myId || !otherUserId) {
      return;
    }

    const senderId = normalizeId(latestMessage.sender);

    const receiverId = normalizeId(latestMessage.receiver);

    const belongsToConversation =
      (senderId === myId && receiverId === otherUserId) ||
      (senderId === otherUserId && receiverId === myId);

    if (!belongsToConversation) {
      return;
    }

    setMessages((previousMessages) => {
      const alreadyExists = previousMessages.some(
        (item) => normalizeId(item._id) === normalizeId(latestMessage._id),
      );

      if (alreadyExists) {
        return previousMessages;
      }

      return [...previousMessages, latestMessage];
    });

    if (senderId === otherUserId) {
      setIsTyping(false);
    }
  }, [latestMessage, myId, otherUserId]);

  /*
   * Refresh history after socket reconnects.
   */
  useEffect(() => {
    if (socketConnected) {
      fetchMessages();
    }
  }, [socketConnected, fetchMessages]);

  /*
   * Online status.
   */
  const isUserOnline = onlineUsers.includes(otherUserId);

  /*
   * Other person's name.
   */
  const chatUserName = chatUser?.name || chatUser?.email || "User";

  /*
   * Other person's role.
   */
  const chatUserRole =
    chatUser?.role === "provider"
      ? "Service Provider"
      : chatUser?.role === "customer"
        ? "Customer"
        : "Sahayra User";

  /*
   * Other person's initials.
   */
  const chatInitials = useMemo(() => {
    return (
      chatUserName
        .trim()
        .split(/\s+/)
        .map((part) => part[0]?.toUpperCase())
        .join("")
        .slice(0, 2) || "U"
    );
  }, [chatUserName]);

  /*
   * Current user's initials.
   */
  const myInitials = useMemo(() => {
    const currentName = user?.name || "You";

    return (
      currentName
        .trim()
        .split(/\s+/)
        .map((part) => part[0]?.toUpperCase())
        .join("")
        .slice(0, 2) || "Y"
    );
  }, [user?.name]);

  /*
   * Scroll to latest.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  /*
   * Format time.
   */
  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /*
   * Get sender name.
   */
  const getSenderName = (item, isMine) => {
    if (isMine) {
      return "You";
    }

    if (item?.senderName) {
      return item.senderName;
    }

    if (item?.sender && typeof item.sender === "object") {
      return item.sender.name || item.sender.email || chatUserName;
    }

    return chatUserName;
  };

  /*
   * Handle typing.
   */
  const handleMessageChange = (event) => {
    const value = event.target.value;

    setMessage(value);

    if (error) {
      setError("");
    }

    if (!socket || !socketConnected || !userId) {
      return;
    }

    clearTimeout(typingTimeoutRef.current);

    if (value.trim()) {
      socket.emit("typing", otherUserId);

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", otherUserId);
      }, 1200);
    } else {
      socket.emit("stopTyping", otherUserId);
    }
  };

  /*
   * Send message.
   */
  const handleSendMessage = () => {
    const text = message.trim();

    if (!text || !userId) {
      return;
    }

    if (!socket || !socketConnected) {
      setError("Chat is reconnecting. Please try again.");

      reconnectSocket();

      return;
    }

    setSending(true);
    setError("");

    clearTimeout(typingTimeoutRef.current);

    socket.emit("stopTyping", otherUserId);

    socket.emit(
      "sendMessage",
      {
        receiver: otherUserId,
        message: text,
      },
      (response) => {
        setSending(false);

        if (!response?.success) {
          setError(response?.message || "Failed to send message.");

          return;
        }

        setMessage("");
      },
    );
  };

  /*
   * Enter to send.
   */
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      handleSendMessage();
    }
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f7] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 h-10 w-24 animate-pulse rounded-xl bg-slate-200" />

          <div className="flex h-[720px] animate-pulse flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(8,19,31,0.06)]">
            <div className="border-b border-slate-200 bg-[#08131f] p-5">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white/10" />

                <div>
                  <div className="h-5 w-40 rounded bg-white/10" />

                  <div className="mt-2 h-3 w-28 rounded bg-white/10" />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6 bg-[#f4f7f7] p-6">
              <div className="h-16 w-2/5 rounded-2xl bg-slate-200" />

              <div className="ml-auto h-16 w-1/2 rounded-2xl bg-slate-200" />

              <div className="h-16 w-2/5 rounded-2xl bg-slate-200" />
            </div>

            <div className="border-t border-slate-200 p-5">
              <div className="h-14 rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * MAIN UI
   * =========================================================
   */

  return (
    <div className="min-h-screen bg-[#f4f7f7] px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* BACK */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0d1b2a] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
        >
          <ArrowLeftIcon />
          Back
        </button>

        {/* CONNECTION WARNING */}
        {!socketConnected && (
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <WifiIcon />
              </div>

              <div>
                <p className="text-sm font-bold text-amber-900">
                  Reconnecting to live chat
                </p>

                <p className="mt-0.5 text-xs text-amber-700">
                  Your chat history is safe.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={reconnectSocket}
              className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-amber-800 transition hover:bg-amber-100"
            >
              Retry connection
            </button>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
            <p className="text-sm font-medium text-rose-700">{error}</p>
          </div>
        )}

        {/* CHAT SHELL */}
        <div className="flex h-[calc(100vh-120px)] min-h-[620px] flex-col overflow-hidden rounded-[30px] border border-[#163247] bg-white shadow-[0_25px_80px_rgba(8,19,31,0.12)]">
          {/* =================================================
              CHAT HEADER
          ================================================= */}

          <div className="relative overflow-hidden border-b border-[#163247] bg-[#08131f] px-5 py-4 sm:px-6">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative flex items-center justify-between gap-4">
              {/* PERSON */}
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/10 bg-gradient-to-br from-cyan-400/20 to-teal-400/10 text-sm font-bold text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.08)] sm:h-14 sm:w-14 sm:text-base">
                    {chatInitials}
                  </div>

                  {isUserOnline && (
                    <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-[#08131f] bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
                  )}
                </div>

                {/* USER INFO */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="truncate text-base font-bold text-white sm:text-lg">
                      {chatUserName}
                    </h1>

                    <span className="hidden rounded-full border border-cyan-300/10 bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-cyan-200 sm:inline-flex">
                      {chatUserRole}
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isUserOnline
                          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                          : "bg-slate-500"
                      }`}
                    />

                    <span
                      className={`text-xs font-medium ${
                        isUserOnline ? "text-emerald-300" : "text-slate-500"
                      }`}
                    >
                      {isUserOnline ? "Online" : "Offline"}
                    </span>

                    <span className="text-slate-600">•</span>

                    <span
                      className={`text-xs font-medium ${
                        socketConnected ? "text-cyan-300" : "text-amber-300"
                      }`}
                    >
                      {socketConnected ? "Live connection" : "Connecting"}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECURITY */}
              <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-semibold text-slate-400 sm:flex">
                <span className="text-teal-300">
                  <ShieldIcon />
                </span>
                Secure conversation
              </div>
            </div>
          </div>

          {/* =================================================
              MESSAGES
          ================================================= */}

          <div className="relative flex-1 overflow-y-auto bg-[#f4f7f7] px-3 py-5 sm:px-6 sm:py-6">
            {/* subtle background */}
            <div className="pointer-events-none absolute inset-0 opacity-40">
              <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-cyan-100/30 blur-3xl" />

              <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-teal-100/30 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-4xl">
              {messages.length === 0 ? (
                /* EMPTY STATE */
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center px-5 text-center">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-[26px] border border-cyan-100 bg-white text-teal-600 shadow-[0_15px_40px_rgba(8,19,31,0.06)]">
                    <div className="absolute inset-2 rounded-[20px] bg-gradient-to-br from-cyan-50 to-teal-50" />

                    <span className="relative">
                      <MessageCircleIcon />
                    </span>
                  </div>

                  <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
                    Private conversation
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#08131f]">
                    Start a conversation
                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Send a message to{" "}
                    <span className="font-bold text-[#0d1b2a]">
                      {chatUserName}
                    </span>{" "}
                    to start your conversation.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {messages.map((item, index) => {
                    const senderId = normalizeId(item.sender);

                    const isMine = senderId === myId;

                    const senderName = getSenderName(item, isMine);

                    return (
                      <div
                        key={item._id || `${item.createdAt}-${index}`}
                        className={`flex items-end gap-2.5 sm:gap-3 ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        {/* OTHER USER AVATAR */}
                        {!isMine && (
                          <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-100 bg-white text-[10px] font-bold text-teal-700 shadow-sm sm:flex">
                            {chatInitials}
                          </div>
                        )}

                        <div className="max-w-[86%] sm:max-w-[68%]">
                          {/* SENDER */}
                          <p
                            className={`mb-1.5 px-1 text-[10px] font-semibold ${
                              isMine
                                ? "text-right text-slate-400"
                                : "text-left text-slate-500"
                            }`}
                          >
                            {senderName}
                          </p>

                          {/* BUBBLE */}
                          <div
                            className={`px-4 py-3.5 text-sm leading-6 ${
                              isMine
                                ? "rounded-[20px] rounded-br-md bg-gradient-to-br from-[#0d3447] to-[#0d5c63] text-white shadow-[0_10px_25px_rgba(8,19,31,0.12)]"
                                : "rounded-[20px] rounded-bl-md border border-slate-200 bg-white text-[#0d1b2a] shadow-[0_8px_25px_rgba(8,19,31,0.05)]"
                            }`}
                          >
                            <p className="break-words">{item.message}</p>
                          </div>

                          {/* TIME */}
                          <p
                            className={`mt-1.5 px-1 text-[10px] text-slate-400 ${
                              isMine ? "text-right" : "text-left"
                            }`}
                          >
                            {formatTime(item.createdAt)}
                          </p>
                        </div>

                        {/* MY AVATAR */}
                        {isMine && (
                          <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-[10px] font-bold text-slate-600 shadow-sm sm:flex">
                            {myInitials}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* TYPING INDICATOR */}
                  {isTyping && (
                    <div className="flex items-end gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-100 bg-white text-[10px] font-bold text-teal-700 shadow-sm">
                        {chatInitials}
                      </div>

                      <div>
                        <p className="mb-1.5 px-1 text-[10px] font-semibold text-slate-500">
                          {chatUserName}
                        </p>

                        <div className="rounded-[20px] rounded-bl-md border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
                          <div className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-400" />

                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-400 [animation-delay:150ms]" />

                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-400 [animation-delay:300ms]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              COMPOSER
          ================================================= */}

          <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* INPUT */}
                <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-slate-200 bg-[#f8fbfb] px-3.5 transition duration-200 focus-within:border-teal-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100/60 sm:px-4">
                  <input
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a message..."
                    className="min-w-0 flex-1 bg-transparent px-1 py-3.5 text-sm font-medium text-[#0d1b2a] outline-none placeholder:text-slate-400 sm:py-4"
                  />
                </div>

                {/* SEND */}
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sending}
                  className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 text-[#08131f] shadow-[0_10px_28px_rgba(34,211,238,0.18)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(34,211,238,0.25)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:bg-none disabled:text-slate-400 disabled:shadow-none"
                  aria-label="Send message"
                >
                  {sending ? (
                    <span className="text-xs font-bold">...</span>
                  ) : (
                    <SendIcon />
                  )}
                </button>
              </div>

              {/* FOOTER STATUS */}
              <div className="mt-2.5 flex items-center justify-between px-1">
                <p className="text-[10px] font-medium text-slate-400">
                  Press Enter to send
                </p>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      socketConnected ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />

                  <p
                    className={`text-[10px] font-semibold ${
                      socketConnected ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {socketConnected ? "Connected" : "Reconnecting"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
