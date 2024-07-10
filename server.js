const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./db');
const Chat = require('./models/Chat');

dotenv.config();
connectDB();

const { sendMessageToLlama } = require('./llama');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// CORS settings
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

// Get all chats
app.get('/api/chats', async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get a specific chat
app.get('/api/chat/:id', async (req, res) => {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
});

// Create a new chat
app.post('/api/create-chat', async (req, res) => {
  try {
    const newChat = new Chat();
    await newChat.save();
    res.json(newChat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Delete a chat
app.delete('/api/chat/:id', async (req, res) => {
  try {
    const chatId = req.params.id;
    await Chat.findByIdAndDelete(chatId);
    res.json({ message: 'Chat deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

// Add a message to a chat
app.post('/api/chat/:id', async (req, res) => {
  const chatId = req.params.id;
  const userMessage = req.body.message;

  try {
    const chat = await Chat.findById(chatId);
    chat.messages.push({ role: "user", content: userMessage });
    const llamaResponse = await sendMessageToLlama(chat.messages);
    const llamaMessage = llamaResponse.message.content;
    chat.messages.push({ role: "assistant", content: llamaMessage });
    await chat.save();
    res.json(chat);
  } catch (error) {
    console.error('Error communicating with Llama 3:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to communicate with Llama 3' });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
