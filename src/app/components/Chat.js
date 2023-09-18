"use client"
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function Home() {
  const [userUUID, setUserUUID] = useState(null);
  const [recipientUUID, setRecipientUUID] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (userUUID && recipientUUID && message) {
      socket.emit('message', { recipientUUID, message });
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('registered', (uuid) => {
      console.log(uuid)
      setUserUUID(uuid);
    });

    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Retrieve the "walletId" cookie from index.js and send it to server.js
    const walletIdCookie = document.cookie.replace(/(?:(?:^|.*;\s*)walletId\s*=\s*([^;]*).*$)|^.*$/, '$1');
    socket.emit('register', walletIdCookie);
  }, []);

  return (
    <div>
      {userUUID ? (
        <div>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Recipient UUID"
            value={recipientUUID}
            onChange={(e) => setRecipientUUID(e.target.value)}
          />
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      ) : null}
    </div>
  );
}
