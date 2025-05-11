import React, { useEffect, useState, useRef } from "react";
import { FaYoutube } from "react-icons/fa6";
import ChatLists from "./ChatLists";
import InputText from "./InputText";
import UserLogin from "./UserLogin";
import socketIOClient from "socket.io-client";

const ChatContainer = () => {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const socketRef = useRef();
  const [chats, setChats] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const [lastSeenStatusMap, setLastSeenStatusMap] = useState({});
  const [otherUsers, setOtherUsers] = useState([]);
  const typingTimeout = useRef(null);

  useEffect(() => {
    socketRef.current = socketIOClient("http://localhost:3002");
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      if (user) socket.emit("userConnected", user);
    });

    socket.on("chat", setChats);

    socket.on("message", (msg) => {
      setChats((prevChats) => [...prevChats, msg]);
    });

    socket.on("typing", (fromUser) => {
      if (fromUser !== user) setTypingStatus(`${fromUser} is typing...`);
    });

    socket.on("stopTyping", () => {
      setTypingStatus("");
    });

    socket.on("onlineUsers", (users) => {
      const filtered = users.filter((username) => username !== user);
      setOtherUsers(filtered);

      // Request last seen for each user
      filtered.forEach((otherUser) => {
        socket.emit("getLastSeen", otherUser);
      });
    });

    socket.on("lastSeen", (data) => {
      setLastSeenStatusMap((prev) => ({
        ...prev,
        [data.username]: data.status === "online"
          ? "Online"
          : `Last Seen: ${new Date(data.lastActive).toLocaleString()}`
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!otherUsers.length) return;

    const interval = setInterval(() => {
      otherUsers.forEach((u) => socketRef.current.emit("getLastSeen", u));
    }, 1000);

    return () => clearInterval(interval);
  }, [otherUsers]);

  const handleTyping = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("typing", user);

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketRef.current.emit("stopTyping", user);
    }, 1000);
  };

  const addMessage = (chat) => {
    const newChat = {
      username: localStorage.getItem("user"),
      message: chat,
      avatar: localStorage.getItem("avatar"),
    };
    socketRef.current.emit("newMessage", newChat);
  };

  const Logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("avatar");
    setUser("");
  };

  return (
    <div>
      {user ? (
        <div className="home">
          <div className="chats_header">
            <h4>Username: {user}</h4>
            <p className="chats_logout" onClick={Logout}>
              <strong>Logout</strong>
            </p>
          </div>

          {/* Display other users' status */}
          <div style={{ marginBottom: "1rem" }}>
            {Object.entries(lastSeenStatusMap).map(([username, status]) => (
              <p key={username}>
                <strong>{username}:</strong>{" "}
                <span
                  style={{
                    color: status === "Online" ? "green" : "gray",
                    fontWeight: status === "Online" ? "bold" : "normal",
                  }}
                >
                  {status}
                </span>
              </p>
            ))}
          </div>

          <ChatLists chats={chats} />
          <InputText addMessage={addMessage} handleTyping={handleTyping} />
          {typingStatus && <p>{typingStatus}</p>}
        </div>
      ) : (
        <UserLogin setUser={setUser} />
      )}
    </div>
  );
};

export default ChatContainer;
