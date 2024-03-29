let chat;
document.addEventListener("DOMContentLoaded", async function()
{
    let chat = localStorage.getItem("currentchat")
    await fetchChatHistory(chat);
});

async function fetchChatHistory(currentchat)
{


}