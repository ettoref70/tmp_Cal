const express = require('express');
const cors = require('cors');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Crea database SQLite (persistente)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'  // File permanente
});

// Definisci il modello Evento
const Event = sequelize.define('Event', {
  title: { type: DataTypes.STRING, allowNull: false },
  start: { type: DataTypes.DATE, allowNull: false },
  end: { type: DataTypes.DATE, allowNull: false },
  room: { type: DataTypes.STRING, allowNull: false }
});

// Sincronizza database
sequelize.sync();

// API REST aggiornate
app.get('/events', async (_, res) => {
  const events = await Event.findAll();
  res.json(events);
});

app.post('/events', async (req, res) => {
  const newEvent = await Event.create(req.body);
  res.status(201).json(newEvent);
  io.emit('eventUpdated', await Event.findAll());
});

app.put('/events/:id', async (req, res) => {
  await Event.update(req.body, { where: { id: req.params.id } });
  res.json(await Event.findByPk(req.params.id));
  io.emit('eventUpdated', await Event.findAll());
});

app.delete('/events/:id', async (req, res) => {
  await Event.destroy({ where: { id: req.params.id } });
  res.status(204).send();
  io.emit('eventUpdated', await Event.findAll());
});

// Avvia server e Socket.IO
const server = app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

const io = require('socket.io')(server, { cors: { origin: "*" } });

io.on('connection', async (socket) => {
  console.log('A user connected');
  socket.emit('loadEvents', await Event.findAll());
});