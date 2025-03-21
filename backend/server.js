const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Gestione eventi
const EVENTS_FILE = path.join(__dirname, 'events.json');

const loadEvents = () => {
  if (!fs.existsSync(EVENTS_FILE)) fs.writeFileSync(EVENTS_FILE, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(EVENTS_FILE));
};

const saveEvents = (events) => fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));

app.get('/events', (_, res) => res.json(loadEvents()));

app.post('/events', (req, res) => {
  const events = loadEvents();
  const newEvent = { id: Date.now(), ...req.body };
  events.push(newEvent);
  saveEvents(events);
  res.status(201).json(newEvent);
});

app.delete('/events/:id', (req, res) => {
  let events = loadEvents();
  events = events.filter(e => e.id !== parseInt(req.params.id));
  saveEvents(events);
  res.status(204).send();
});

// Modifica evento esistente
app.put('/events/:id', (req, res) => {
  let events = loadEvents();
  events = events.map(event => event.id === parseInt(req.params.id) ? { ...event, ...req.body } : event);
  saveEvents(events);
  res.json(events.find(event => event.id === parseInt(req.params.id)));
});

// Serve il frontend staticamente
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
