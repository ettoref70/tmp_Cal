const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const dbPath = process.env.NODE_ENV === 'production' 
  ? '/data/db-volume/database.sqlite' // Railway volume path
  : path.join(__dirname, 'database.sqlite'); // Local development path

// Database SQLite
const db = new Database(dbPath);


// Crea tabella se non esiste
db.prepare(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    start TEXT,
    end TEXT,
    room TEXT
  )
`).run();

// API REST aggiornate
app.get('/events', (req, res) => {
  const events = db.prepare('SELECT * FROM events').all();
  res.json(events);
});

app.post('/events', (req, res) => {
  const { title, start, end, room } = req.body;
  const stmt = db.prepare('INSERT INTO events (title, start, end, room) VALUES (?, ?, ?, ?)');
  const info = stmt.run(title, start, end, room);
  const newEvent = { id: info.lastInsertRowid, title, start, end, room };
  io.emit('eventUpdated', db.prepare('SELECT * FROM events').all());
  res.status(201).json(newEvent);
});

app.put('/events/:id', (req, res) => {
  const { title, start, end, room } = req.body;
  const stmt = db.prepare('UPDATE events SET title = ?, start = ?, end = ?, room = ? WHERE id = ?');
  stmt.run(title, start, end, room, req.params.id);
  io.emit('eventUpdated', db.prepare('SELECT * FROM events').all());
  res.json({ id: req.params.id, title, start, end, room });
});

app.delete('/events/:id', (req, res) => {
  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  io.emit('eventUpdated', db.prepare('SELECT * FROM events').all());
  res.status(204).send();
});

// Server e Socket.IO
const server = app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

const io = require('socket.io')(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('loadEvents', db.prepare('SELECT * FROM events').all());
});