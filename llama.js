const axios = require('axios');

const llamaApiUrl = process.env.LLAMA_API_URL; // URL for Llama 3 API

const sendMessageToLlama = async (messages) => {
  try {
    const response = await axios.post(`${llamaApiUrl}/api/chat`, {
      model: "llama3",
      messages: messages,
      stream: false
    });

    return response.data;
  } catch (error) {
    console.error('Error sending message to Llama 3:', error);
    throw error;
  }
};

module.exports = { sendMessageToLlama };