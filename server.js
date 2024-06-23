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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


let chatHistory = [];


app.get('/', async (req, res) => {
    const chats = await Chat.find();
    res.render('index', { chats: chats });
});


app.post('/chat/:id', async (req, res) => {
  const chatId = req.params.id;
  const userMessage = req.body.message;

  try {
    const chat = await Chat.findById(chatId);
    chat.messages.push({ role: "user", content: userMessage });
    const llamaResponse = await sendMessageToLlama(chat.messages);
    const llamaMessage = llamaResponse.message.content;
    // console.log(llamaResponse.message);
    chat.messages.push({ role: "assistant", content: llamaMessage });
    await chat.save();
    res.redirect(`/chat/${chatId}`);
  } catch (error) {
    console.error('Error communicating with Llama 3:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to communicate with Llama 3' });
  }
});


app.get('/chat/:id', async (req, res) => {
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId);
  res.render('chat', { chat: chat });
});

app.post('/create-chat', async (req, res) => {
  const newChat = new Chat();
  await newChat.save();
  res.redirect(`/chat/${newChat._id}`);
});