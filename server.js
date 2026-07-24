const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Izinkan akses dari aplikasi desktop (origin berbeda: file:// atau app://)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'app')));

app.get('/api/data', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, content) => {
    if (err) return res.json({});
    try { res.json(JSON.parse(content)); }
    catch (e) { res.json({}); }
  });
});

app.post('/api/data', (req, res) => {
  fs.writeFile(DATA_FILE, JSON.stringify(req.body), (err) => {
    if (err) {
      console.error('Gagal menyimpan data:', err);
      return res.status(500).json({ ok: false });
    }
    res.json({ ok: true });
  });
});

// Cek sehat, dipakai hosting untuk memastikan server hidup
app.get('/health', (req, res) => res.send('OK'));

app.listen(PORT, () => {
  console.log('Kantin Pintar server berjalan di port ' + PORT);
});
