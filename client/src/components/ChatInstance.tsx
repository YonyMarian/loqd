import React, { useState } from 'react';
import RealtimeChat from './RealtimeChat';

export default function ChatInstance() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim()) setJoined(true);
  };

  return (
    <div>
      {!joined ? (
        <form onSubmit={handleJoin} style={{ margin: '2rem', textAlign: 'center' }}>
          <h2>Enter your username</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name"
            required
          />
          <button type="submit">Join Chat</button>
        </form>
      ) : (
        <RealtimeChat roomName="global" username={username} />
      )}
    </div>
  );
}
