const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const EVENTS_FILE = path.join(__dirname, 'events.json');

const loadEvents = () => {
  if (!fs.existsSync(EVENTS_FILE)) fs.writeFileSync(EVENTS_FILE, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(EVENTS_FILE));
};

const saveEvents = (events) => fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));

const server = app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
const io = require('socket.io')(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
  console.log('A user connected');

  // Invia eventi esistenti appena il client si connette
  socket.emit('loadEvents', loadEvents());
});

// API REST attuali
app.get('/events', (_, res) => res.json(loadEvents()));

app.post('/events', (req, res) => {
  const events = loadEvents();
  const newEvent = { id: Date.now(), ...req.body };
  events.push(newEvent);
  saveEvents(events);
  io.emit('eventUpdated', events); // Notifica a tutti i client
  res.status(201).json(newEvent);
});

app.put('/events/:id', (req, res) => {
  let events = loadEvents();
  events = events.map(e => e.id === parseInt(req.params.id) ? { ...e, ...req.body } : e);
  saveEvents(events);
  io.emit('eventUpdated', events); // Notifica a tutti i client
  res.json(events.find(e => e.id === parseInt(req.params.id)));
});

app.delete('/events/:id', (req, res) => {
  let events = loadEvents();
  events = events.filter(e => e.id !== parseInt(req.params.id));
  saveEvents(events);
  io.emit('eventUpdated', events); // Notifica a tutti i client
  res.status(204).send();
});
