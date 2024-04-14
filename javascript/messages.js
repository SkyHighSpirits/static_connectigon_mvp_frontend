var socket = new SockJS('http://localhost:8080/ws');
var stompClient = Stomp.over(socket);
let currentChat;
let currentUser;

stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/chat/{chatId}', function (message) {
        displayMessage(JSON.parse(message.body));
    });
});

function sendMessage() {
    var messageInput = document.getElementById('messageInput');
    var message = messageInput.value.trim();

    currentChat = JSON.parse(localStorage.getItem("currentchat"));

    if (message === '') return; // Do not send empty messages

    var id = parseInt(currentChat.id);

    currentUser = JSON.parse(localStorage.getItem("currentuser"));

    var user_id = parseInt(currentUser.id);

    if (!isNaN(id)) {
        var url = "/app/chat/" + id + "/" + user_id + "/sendMessage";
        stompClient.send(url, {}, message); // Send the message as a string directly
        messageInput.value = ''; // Clear the input field
    }
}

// Function to display a message
function displayMessage(message) {
    var messageContainer = document.createElement('div');
    var chatMessages = document.getElementById('chatMessages');
    var messageElement = document.createElement('div');

    // Check if the message sender is the current user
    var isCurrentUser = message.sentByUserid.id === currentUser.id;

    // Set the text content of the message element
    messageElement.innerHTML = message.sentByUserid.name + "<br><br>" + message.message;




    // Add a class to the message element based on the sender
    if (isCurrentUser) {
        messageElement.classList.add('sent-message');
        messageContainer.classList.add('sent-message-container');
    } else {
        messageElement.classList.add('received-message');
        messageContainer.classList.add('received-message-container');
    }

    // Append the message element to the chat messages container
    chatMessages.appendChild(messageContainer);
    messageContainer.appendChild(messageElement);

    var chatContainer = document.querySelector('.chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;

}

document.addEventListener('DOMContentLoaded', async function() {
    // Fetch chat messages when the DOM is loaded
    currentChat = JSON.parse(localStorage.getItem("currentchat"));
    currentUser = JSON.parse(localStorage.getItem("currentuser"));
    await fetch('http://localhost:8080/getAllMessagesFromChat?chatid=' + currentChat.id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(messages => {
            // Process the fetched messages
            messages.forEach(message => {
                displayMessage(message);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});