function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

const chatMessages = document.getElementById('chat-message')
const userInput = document.getElementById('user-input')
const sendButton = document.getElementById('send-button')

// Call backend instead of Gemini directly
async function generateResponse(prompt){

    const response = await fetch('http://localhost:3000/gemini', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({ prompt })
    })

    if(!response.ok){
        throw new Error('Failed to give response')
    }

    const data = await response.json()

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI"
}

function cleanMarkdown(text) {
    return text
        .replace(/#{1,6}\s?/g,'')
        .replace(/\*\*/g,'')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function addMessage(message,isUser) {

    const messageElement = document.createElement('div')
    messageElement.classList.add('message')
    messageElement.classList.add(isUser?'user-message':'bot-message')

    const profileImage = document.createElement('img')
    profileImage.classList.add('profile-image')
    profileImage.src = isUser ? 'logo2.png':'bot2.png'
    profileImage.alt = isUser? 'User' : 'bot'

    const messageContent = document.createElement('div')
    messageContent.classList.add('message-content')
    messageContent.textContent= message

    messageElement.appendChild(profileImage)
    messageElement.appendChild(messageContent)

    chatMessages.appendChild(messageElement)
}

function localBotReply(input){

    input = input.toLowerCase()

    if(input.includes("what is ict?")){
        return "ICT stands for Information and Communication Technology. It refers to the use of digital technologies such as computers, the internet, software applications, and communication systems to create, store, transmit, and manage information. ICT plays an important role in education, business, healthcare, and government by improving communication efficiency and productivity."
    }

    else if(input.includes("importance of ict")){
        return "ICT is important because it helps people communicate quickly and efficiently across the world. It improves learning through online education, supports businesses through digital systems, enhances research through access to global information, and allows governments to provide better public services. In modern society, ICT is essential for economic growth and technological development."
    }

    else if(input.includes("examples of ict")){
        return "Examples of ICT include computers, smartphones, tablets, the internet, email systems, social media platforms, video conferencing tools, cloud storage services, and software applications such as Microsoft Office and database systems. These technologies allow users to process and share information digitally."
    }

    else if(input.includes("hardware")){
        return "Hardware refers to the physical components of a computer system that you can see and touch. Examples include the monitor, keyboard, mouse, CPU, printer, hard drive, and motherboard. Hardware works together with software to perform tasks and process information."
    }

    else if(input.includes("software")){
        return "Software refers to the programs and applications that run on a computer system. Unlike hardware, software cannot be physically touched. Examples include operating systems like Windows, application software like Microsoft Word, and web browsers like Google Chrome. Software tells the hardware what tasks to perform."
    }

    else if(input.includes("internet")){
        return "The Internet is a global network of interconnected computers that allows users to share information and communicate worldwide. It enables services such as websites, email, online learning, video streaming, and cloud computing. The Internet has transformed the way people access information and interact with others."
    }

    else if(input.includes("cyber security") || input.includes("cybersecurity")){
        return "Cybersecurity refers to the practice of protecting computer systems, networks, and data from digital attacks, theft, or damage. It involves using strong passwords, firewalls, antivirus software, and secure networks to prevent unauthorized access. Cybersecurity is very important in ICT to protect sensitive information."
    }

    else if(input.includes("programming")){
        return "Programming is the process of writing instructions that tell a computer how to perform specific tasks. These instructions are written using programming languages such as JavaScript, Python, Java, and C++. Programming is essential in developing software applications, websites, mobile apps, and artificial intelligence systems."
    }

    else if(input.includes("database")){
        return "A database is an organized collection of data that can be easily accessed, managed, and updated. Databases are used in schools, hospitals, businesses, and government offices to store important information such as student records, employee details, and transaction data."
    }

    else if(input.includes("artificial intelligence") || input.includes("ai")){
        return "Artificial Intelligence, commonly known as AI, is a branch of ICT that enables machines to simulate human intelligence. AI systems can learn from data, recognize patterns, make decisions, and solve problems. Examples of AI include chatbots, facial recognition systems, recommendation systems, and virtual assistants."
    }

    else if(input.includes("help")){
        return "I can answer questions related to ICT such as: What is ICT? What is hardware and software? What is the Internet? What is cybersecurity? What is programming? What is a database? What is Artificial Intelligence? Please type your ICT question and I will provide a detailed explanation."
    }

    else{
        return null
    }
}
async function handleUserInput() {

    const userMessage = userInput.value.trim()
    if(!userMessage) return

    addMessage(userMessage,true)

    function showTyping(){

    const typingElement = document.createElement('div')
    typingElement.classList.add('message','bot-message')

    const typingBubble = document.createElement('div')
    typingBubble.classList.add('typing')
    typingBubble.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `

    typingElement.appendChild(typingBubble)
    chatMessages.appendChild(typingElement)

    return typingElement
}

    userInput.value=''

    sendButton.disabled= true
    userInput.disabled = true

    const typingBubble = showTyping()

    try {

        await delay(1000)

        const localReply = localBotReply(userMessage)

        let botMessage

        if(localReply){
            botMessage = localReply
        }
        else{
            const aiResponse = await generateResponse(userMessage)
            botMessage = cleanMarkdown(aiResponse)
        }

        typingBubble.remove()
        addMessage(botMessage,false)

    } 
    catch (error) {
        typingBubble.remove()
        addMessage('Sorry, AI is currently offline.',false)
    }
    finally{
        sendButton.disabled=false
        userInput.disabled=false
        userInput.focus()
    }
}
sendButton.addEventListener('click',handleUserInput)

userInput.addEventListener("keypress",function(e){
    if(e.key === "Enter"){
        e.preventDefault()
        handleUserInput()
    }
})

userInput.addEventListener('keypress', (e) => {
// Adds an event listener for when a key is pressed in the input field.
if (e.key === 'Enter' && !e. shiftKey) {
// Checks if the 'Enter' key is pressed and Shift is not held (to distinguish from Shift+Enter for newlines).
e.preventDefault();
// Prevents the default behavior of adding a newline.

IhandleUserInput();
// Calls `handleUserInput' to send the message.
}
});