let me;
let them;
let chatsData;
document.addEventListener("DOMContentLoaded", async function()
{
    await assingMe()
    console.log("i´m logged in as: " + me)
    await assingChatsData()
    console.log(chatsData)
});


function assingMe()
{
    me = JSON.parse(localStorage.getItem("currentuser"));
}

// Sample chat data
async function fetchMyChats(id)
{
    try {
        const response = await fetch(`http://localhost:8080/getallmychats?userId=${id}`);

        if (response.ok) {
            const chats = await response.json(); // Convert response body to JSON
            console.log('Chats fetched successfully:', chats);
            return chats; // Return the fetched chats array
        } else if (response.status === 404) {
            throw new Error('Chats not found');
        } else {
            throw new Error('Failed to fetch chats');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch chats. Please try again later.');
    }
}

// Function to create chat items dynamically
async function createChatItem(chat) {
    const chatList = document.getElementById('chat-list');
    const chatItem = document.createElement('li');
    chatItem.classList.add('chat-item');
    console.log(chat);

    // Wait for the other actor to be determined
    await findOtherActor(chat);

    const profileImg = document.createElement('img');
    profileImg.src = "images/1.png";
    profileImg.alt = 'Profile Image';
    profileImg.classList.add('profile-img');

    const profileName = document.createElement('p');
    profileName.textContent = "Chat with " + them.name;
    profileName.classList.add('profile-name');

    chatItem.appendChild(profileImg);
    chatItem.appendChild(profileName);
    chatList.appendChild(chatItem);

    // Attach click event handler after the chat item is created
    chatItem.onclick = function() {
        handleChatClick(chat);
    };
}

async function findOtherActor(chat)
{
    if(chat.user1.email === me.email)
    {
        them = chat.user2;
        console.log(chat.user2)
    }
    else
    {
        them = chat.user1
        console.log(chat.user1)
    }
}

// Function to handle chat click event
function handleChatClick(chat) {
    alert('Clicked on chat with ' + them.name);
    localStorage.setItem("currentchat", chat)
    window.location.replace("messages.html")
    // Add your logic to handle the click event here
}

async function assingChatsData()
{
    chatsData = await fetchMyChats(me.id);
    chatsData.forEach(chat => {
        createChatItem(chat);
    });
}

// Dynamically create chat items
