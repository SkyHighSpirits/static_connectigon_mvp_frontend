var socket = new SockJS('http://localhost:8080/ws');
var stompClient = Stomp.over(socket);

stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/chat/{chatId}', function (message) {
        displayMessage(JSON.parse(message.body));
    });
});

function sendMessage() {
    var messageInput = document.getElementById('messageInput');
    var message = messageInput.value.trim();
    if (message === '') return; // Do not send empty messages

    stompClient.send("/app/chat/{chatId}/sendMessage", {}, JSON.stringify({ content: message }));
    messageInput.value = ''; // Clear the input field
}

function displayMessage(message) {
    var chatMessages = document.getElementById('chatMessages');
    var messageElement = document.createElement('div');
    messageElement.textContent = message.content;
    chatMessages.appendChild(messageElement);
}