const express = require('express');
const WebSocket = require('ws');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Map();

// WebSocket connection event
const Websocket = wss.on('connection', (ws) => {
    // Generate a unique ID for each client
    const clientId = generateUniqueId();
  
    // Store the client in the clients map
    clients.set(clientId, ws);
  
    // Handle incoming messages
    ws.on('message', (message) => {
      // Parse the message JSON
      const data = JSON.parse(message);
  
      // Extract the recipient ID from the message
      const recipientId = data.recipientId;
  
      // Find the recipient WebSocket client
      const recipient = clients.get(recipientId);
  
      if (recipient) {
        // Send the message to the recipient
        recipient.send(JSON.stringify({ senderId: clientId, message: data.message }));
      } else {
        // Handle recipient not found
        ws.send(JSON.stringify({ error: 'Recipient not found' }));
      }
    });
  
    // Handle client disconnection
    ws.on('close', () => {
      // Remove the client from the clients map
      clients.delete(clientId);
    });
  });
  
  // Generate a unique ID
  function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }


module.exports = Websocket;