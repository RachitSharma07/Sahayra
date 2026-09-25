import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { io } from "socket.io-client";

import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const socketRef = useRef(null);

  const [socket, setSocket] = useState(null);

  const [socketConnected, setSocketConnected] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState([]);

  /*
   * IMPORTANT:
   * Support all possible ID formats.
   */
  const currentUserId = user?.id || user?._id || user?.userId || null;

  /*
   * Latest incoming message.
   *
   * Chat components listen to this
   * instead of directly managing
   * receiveMessage listeners.
   */
  const [latestMessage, setLatestMessage] = useState(null);

  /*
   * Normalize IDs
   */
  const normalizeId = useCallback((value) => {
    if (!value) {
      return "";
    }

    return value.toString();
  }, []);

  /*
   * Update online users
   */
  const handleOnlineUsers = useCallback(
    (users) => {
      setOnlineUsers((users || []).map((id) => normalizeId(id)));
    },
    [normalizeId],
  );

  /*
   * Create global Socket.IO connection.
   */
  useEffect(() => {
    /*
     * Wait until AuthContext has finished
     * checking the current authentication state.
     */
    if (authLoading) {
      return;
    }

    const token = localStorage.getItem("token");

    /*
     * No authenticated user/token = no socket.
     */
    if (!token || !currentUserId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      setSocket(null);
      setSocketConnected(false);
      setOnlineUsers([]);
      setLatestMessage(null);

      return;
    }

    /*
     * If socket already exists for this
     * authenticated session, don't create another.
     */
    if (socketRef.current) {
      return;
    }

    console.log("Creating global Socket.IO connection...");

    const newSocket = io("import.meta.env.VITE_API_URL", {
      auth: {
        token,
      },

      autoConnect: true,

      transports: ["polling", "websocket"],

      reconnection: true,

      reconnectionAttempts: Infinity,

      reconnectionDelay: 500,

      reconnectionDelayMax: 3000,

      timeout: 5000,
    });

    socketRef.current = newSocket;

    setSocket(newSocket);

    /*
     * CONNECTED
     */
    const onConnect = () => {
      console.log("Global Socket connected:", newSocket.id);

      setSocketConnected(true);

      newSocket.emit("requestOnlineUsers");
    };

    /*
     * CONNECTION ERROR
     */
    const onConnectError = (error) => {
      console.error("Global Socket connection error:", error.message);

      setSocketConnected(false);
    };

    /*
     * DISCONNECT
     */
    const onDisconnect = (reason) => {
      console.log("Global Socket disconnected:", reason);

      setSocketConnected(false);

      setOnlineUsers([]);
    };

    /*
     * LIVE MESSAGE
     */
    const onReceiveMessage = (incomingMessage) => {
      console.log("Global message received:", incomingMessage);

      const normalizedMessage = {
        ...incomingMessage,

        _id: normalizeId(incomingMessage?._id),

        sender: normalizeId(incomingMessage?.sender),

        receiver: normalizeId(incomingMessage?.receiver),
      };

      setLatestMessage(normalizedMessage);
    };

    /*
     * ONLINE USERS
     */
    const onOnlineUsers = (users) => {
      handleOnlineUsers(users);
    };

    /*
     * RECONNECT
     */
    const onReconnect = (attempt) => {
      console.log("Global socket reconnected after:", attempt);

      setSocketConnected(true);

      newSocket.emit("requestOnlineUsers");
    };

    /*
     * REGISTER EVENTS
     */
    newSocket.on("connect", onConnect);

    newSocket.on("connect_error", onConnectError);

    newSocket.on("disconnect", onDisconnect);

    newSocket.on("receiveMessage", onReceiveMessage);

    newSocket.on("onlineUsers", onOnlineUsers);

    newSocket.io.on("reconnect", onReconnect);

    /*
     * Visibility recovery
     */
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const activeSocket = socketRef.current;

        if (activeSocket && !activeSocket.connected) {
          console.log("Page visible - reconnecting...");

          activeSocket.connect();
        }

        if (activeSocket?.connected) {
          activeSocket.emit("requestOnlineUsers");
        }
      }
    };

    /*
     * Window focus recovery
     */
    const handleFocus = () => {
      const activeSocket = socketRef.current;

      if (activeSocket && !activeSocket.connected) {
        console.log("Window focused - reconnecting...");

        activeSocket.connect();
      }

      if (activeSocket?.connected) {
        activeSocket.emit("requestOnlineUsers");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    window.addEventListener("focus", handleFocus);

    /*
     * CLEANUP
     */
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);

      window.removeEventListener("focus", handleFocus);

      newSocket.off("connect", onConnect);

      newSocket.off("connect_error", onConnectError);

      newSocket.off("disconnect", onDisconnect);

      newSocket.off("receiveMessage", onReceiveMessage);

      newSocket.off("onlineUsers", onOnlineUsers);

      newSocket.io.off("reconnect", onReconnect);

      newSocket.disconnect();

      socketRef.current = null;

      setSocket(null);
      setSocketConnected(false);
      setOnlineUsers([]);
      setLatestMessage(null);
    };
  }, [authLoading, currentUserId, handleOnlineUsers, normalizeId]);

  /*
   * Manual reconnect
   */
  const reconnectSocket = useCallback(() => {
    const activeSocket = socketRef.current;

    if (!activeSocket) {
      return;
    }

    if (!activeSocket.connected) {
      activeSocket.connect();
    } else {
      activeSocket.emit("requestOnlineUsers");
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        socketConnected,
        onlineUsers,
        latestMessage,
        currentUserId,
        reconnectSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }

  return context;
}
