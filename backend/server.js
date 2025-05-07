// server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Dummy data pengguna
const data = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  nama: `User ${i + 1}`,
  umur: 20 + (i % 10)
}));

// Endpoint pengambilan data pengguna per halaman
app.get('/api/pengguna', (req, res) => {
  const page = parseInt(req.query.page || '1');
  const size = 10;
  const start = (page - 1) * size;
  const end = start + size;
  const users = data.slice(start, end);
  setTimeout(() => res.json(users), 1000); // Simulasi delay 1 detik
});

// Endpoint streaming pengguna satu per satu
app.get('/api/pengguna-stream', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked');

  for (let i = 0; i < data.length; i++) {
    const user = data[i];
    res.write(JSON.stringify(user) + '\n');
    await new Promise(resolve => setTimeout(resolve, 300)); // Delay 300ms per user
  }

  res.end();
});

// Menjalankan server
app.listen(5000, () => {
  console.log('Server berjalan di http://localhost:5000');
});
