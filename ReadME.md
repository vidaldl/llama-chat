# Overview
 This project was an interesting journey. I set out to make my own API on Node that connects to my personal computer running Llama3 which will have access to all of my files and more. I am going to be building on top of this in the near future to accomplish this.

 **[Update]** \
 I added Mongoose to the project. That way chats are saved not in the memory but are persistent. 
 \
 \
 I will be focusing on making it better looking next!
 
 

[Check out my demo video!](https://youtu.be/2X6Kk8yyPNA)

# Development Environment

I used VS Code as a code editor, Ollama running Llama3, and Node in this project. I also used PostMan to test my calls to the local Ollama server.

# Useful Websites

* [Ollama](https://ollama.com/)
* [Python](https://www.w3schools.com/typescript/)
* [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-completion)
* [Postman](https://www.postman.com/)
* [Mongoose](https://mongoosejs.com/docs/)


## Requirements

- NodeJS
- Ollama


## Installation

1. **Clone the repository:**
   ```bash
   git clone git@github.com:vidaldl/llama-chat.git
   cd llama-chat
   ```

2. **Install the required libraries:**
   ```bash
   npm install
   ```

3. **Install Ollama and set up Llama3**
    - macOS:
        ```bash
        brew install ollama
        ```
    - Windows:
        Download the installer from the [Ollama](https://ollama.com/) website and follow the instructions.
    - Install the Llama3 model:
        ```bash
        ollama install llama3
        ```

4. **Start the Ollama server**
   ```bash
   ollama serve
   ```

## Usage
1. **Interact with Llama3:** \
    Run the Node server and access [localhost:3000](http://localhost:3000/) to start a conversation with Llama3:
    ```bash
   npm start
   ```

