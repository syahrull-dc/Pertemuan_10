import React, { useState } from 'react';

const StreamingView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleStartStream = async () => {
    setUsers([]);
    setLoading(true);

    const response = await fetch('http://localhost:5000/api/pengguna-stream');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let lines = buffer.split('\n');
      buffer = lines.pop(); // sisakan potongan incomplete

      for (const line of lines) {
        if (line.trim() !== '') {
          const user = JSON.parse(line);
          setUsers(prev => [...prev, user]);
        }
      }
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #aaa', marginTop: '2rem' }}>
      <h2>Streaming Pengguna</h2>
      <button onClick={handleStartStream} disabled={loading}>
        {loading ? 'Memuat...' : 'Mulai Streaming'}
      </button>

      <ul style={{ marginTop: 20 }}>
        {users.map(user => (
          <li key={user.id}>
            {user.nama} - Umur: {user.umur}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StreamingView;
