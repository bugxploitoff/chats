"use client"
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://cdn.pwnme.in');

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
    <div className="flex h-screen">
    <div className="w-1/2 bg-gray-100 p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Your Messages</h2>
        <div className="border-t border-gray-300 mt-2 py-2">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              {msg}
            </div>
          ))}
        </div>
      </div>
      <div>
        <input
          type="text"
          placeholder="Recipient UUID"
          value={recipientUUID}
          onChange={(e) => setRecipientUUID(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white rounded-full py-2 px-4 hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
    <div className="w-1/2 bg-gray-200 p-4">
      <h2 className="text-lg font-semibold">Connected Users</h2>
      <div className="border-t border-gray-300 mt-2 py-2">
        {/* Display the connected users here */}
      </div>
    </div>
  </div>
  );
}
