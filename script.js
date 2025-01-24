const img = document.getElementById("image");
const textarea = document.getElementById("text");
const chatBox = document.querySelector(".chatbox");

let userMsg;

// Create a new li element with parameters userMsg as message and outgoing as the className
const createLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("box", className);

    // If className is outgoing then it displays the message 
    let content = className === "outgoing" 
        ? `<p>${message}</p>` 
        : `<img src="image/bot_icon.jpg" alt=""><p>${message}</p>`;
        
    chatLi.innerHTML = content;
    return chatLi;
};

// Function to handle the incoming response
async function chatIncome(incomingChatli) {
    const url = 'https://open-ai21.p.rapidapi.com/claude3';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': 'c1166136e6msh3f5a0aaeb47900bp13ef49jsn41756b267902',
            'x-rapidapi-host': 'open-ai21.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: [
                {
                    role: 'user',
                    content: userMsg // use the user message here
                }
            ],
            web_access: false
        })
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json(); // Parse response to JSON
        console.log(result);

        // Update the chat box with the response from the API
        const thinkingLi=document.querySelector(".incoming:last-child");
        if(thinkingLi){
            chatBox.removeChild(thinkingLi)
        }
         // Extract the assistant's response
      const botMsg =result.result;
        // Append the bot's message to the chatbox
        chatBox.appendChild(createLi(botMsg, "incoming"));

        incomingChatli.innerHTML = `<img src="image/bot_icon.jpg" alt=""><p>${result}</p>`;
    } catch (error) {
        console.error(error);
        incomingChatli.innerHTML = `<img src="image/bot_icon.jpg" alt=""><p>Error occurred!</p>`;
    }
    
}

// Function to display the text typed in input box to LI
const chat = () => {
    userMsg = textarea.value.trim();
    if (!userMsg)
        return;

    // Append the userMsg to the chatbox
    chatBox.appendChild(createLi(userMsg, "outgoing"));
  

    // Display the Thinking... message while waiting for the response.
    setTimeout(() => {
        const incomingChatli = createLi("Thinking....", "incoming");
        chatBox.appendChild(incomingChatli);
        chatIncome(incomingChatli); 
    }, 400);
};

img.addEventListener("click", chat);
