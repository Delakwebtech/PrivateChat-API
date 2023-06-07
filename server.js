const express = require('express');
const WebSocket = require('./websocket');

const app = express();
const server = require('http').createServer(app);

const clients = new Map();

// Express middleware to parse JSON request bodies
app.use(express.json());

// Express API route to send a message
app.post('/api/send-message', (req, res) => {
  const { senderId, recipientId, message } = req.body;

  const sender = clients.get(senderId);
  const recipient = clients.get(recipientId);

  if (sender && recipient) {
    const payload = { senderId, message };
    recipient.send(JSON.stringify(payload));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Recipient not found' });
  }
});

// Start the server
server.listen(3000, () => {
  console.log('Server started on port 3000');
});
