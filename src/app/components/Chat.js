import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://cdn.pwnme.in');

export default function Home() {
  const [userUUID, setUserUUID] = useState(null);
  const [recipientUUID, setRecipientUUID] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);

  const sendMessage = () => {
    if (userUUID && recipientUUID && message) {
      socket.emit('message', { recipientUUID, message });
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('registered', (uuid) => {
      setUserUUID(uuid);
    });

    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('connectedUsers', (users) => {
      setConnectedUsers(users);
    });

    // Retrieve the "walletId" cookie from index.js and send it to server.js
    const walletIdCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)walletId\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    socket.emit('register', walletIdCookie);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };


  return (
    <div className="flex h-screen">
      <div className="w-3/12 bg-gray-200 p-4">
        <h2 className="text-lg font-semibold">Connected Users</h2>
        <div className="border-t border-gray-300 mt-2 py-2">
          <ul>
            {connectedUsers.map((user) => (
              <li
                key={user}
                onClick={() => setRecipientUUID(user)}
                className="cursor-pointer hover:underline"
              >
                {user}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-9/12 bg-gray-100 p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Your Messages</h2>
          <div
            className="border-t border-gray-300 mt-2 py-2 max-h-60 overflow-y-auto"
            style={{ maxHeight: '46rem' }} // Adjust the maxHeight as needed
          >
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                {msg}
              </div>
            ))}
          </div>
        </div>
         <form onSubmit={handleSubmit}>
         <div className="mb-6">
            <label
              htmlFor="large-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Type Wallet id
            </label>
            <input
              placeholder="Wallet id"
              value={recipientUUID}
              onChange={(e) => setRecipientUUID(e.target.value)}
              id="large-input"
              className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="large-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Type your message
            </label>
            <input
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              id="large-input"
              className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
