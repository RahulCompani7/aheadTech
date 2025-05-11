import React, { useState, useEffect } from "react";

const InputText = ({ addMessage, handleTyping }) => {
  const [message, setMessage] = useState("");

  // Use useEffect to stop typing after a delay
  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      if (message.trim()) {
        handleTyping(); // Notify the server that the user is typing
      }
    }, 500); // Delay of 500ms

    return () => clearTimeout(typingTimeout); // Clean up the timeout on unmount
  }, [message, handleTyping]);

  const sendMessage = () => {
    if (message.trim()) {
      addMessage(message); // Add the message to the chat
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div className="inputtext_container">
      <textarea
        name="message"
        id="message"
        rows="6"
        placeholder="Input Message ..."
        onChange={(e) => setMessage(e.target.value)} // Update message on input
        value={message}
      ></textarea>
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default InputText;
