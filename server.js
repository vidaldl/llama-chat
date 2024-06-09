const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

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


app.get('/', (req, res) => {
    res.render('index', { chatHistory: chatHistory });
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  chatHistory.push({ role: "user", content: userMessage });
  try {
    const llamaResponse = await sendMessageToLlama(chatHistory);
    chatHistory.push(llamaResponse.message);
    
    res.redirect('/');
  } catch (error) {
    console.error('Error communicating with Llama 3:', error.response ? error.response.data : error.message);
    chatHistory.push({ role: "assistant", content: 'Failed to communicate with Llama 3' });
    res.redirect('/')
  }
});