// Sample profile data
let profilesData;
let clickedProfile;
let myProfile;

async function fetchProfiles()
{
    await fetch('http://localhost:8080/getfromalgorithm')
        .then(response => {
            if (response.ok) {
                return response.json(); // Convert response body to JSON
            } else {
                throw new Error('Failed to fetch users from algorithm');
            }
        })
        .then(data => {
            // Handle the retrieved user list
            console.log(data); // Log the data to the console
            // Further processing of data if needed
            profilesData = data;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch users from algorithm. Please try again later.');
        });
}
document.addEventListener("DOMContentLoaded", async function() {
    await fetchProfiles();
    await populateProfilePage();
    myProfile = JSON.parse(localStorage.getItem("currentuser"))
});


// Function to create profile boxes dynamically
function createProfileBox(profile) {
    const profileGrid = document.getElementById('profile-grid');
    const profileBox = document.createElement('div');
    profileBox.classList.add('profile-box');
    profileBox.onclick = function() {
        clickedProfile = profile;
        console.log(myProfile)
        console.log(clickedProfile)
        viewProfile();
    };

    const profileImg = document.createElement('div');
    profileImg.classList.add('profile-img');

    const profileName = document.createElement('div');
    profileName.classList.add('profile-name');
    profileName.textContent = profile.name + ", " + profile.age + " Y/O";

    const profileTitle = document.createElement('div');
    profileTitle.classList.add('profile-title');
    profileTitle.textContent = profile.title;

    const profileDescription = document.createElement('div');
    profileDescription.classList.add('profile-description');
    profileDescription.textContent = profile.description;

    const profileVoicePicture = document.createElement('div');
    profileVoicePicture.classList.add('profile-voice-img');


    profileBox.appendChild(profileImg);
    profileBox.appendChild(profileName);
    profileBox.appendChild(profileTitle);
    profileBox.appendChild(profileDescription);
    profileBox.appendChild(profileVoicePicture);
    profileGrid.appendChild(profileBox);
}

// Function to view profile (example action)
async function viewProfile() {
    const overlay = document.getElementById('overlay');
    const expandedProfile = document.getElementById('expanded-profile');
    const expandedName = document.getElementById('expanded-name');
    const expandedDescription = document.getElementById('expanded-description');

    expandedName.textContent = clickedProfile.name + ", " + clickedProfile.title + ", " + clickedProfile.age + " Y/O ";
    expandedDescription.textContent = clickedProfile.description;

    overlay.style.display = 'flex';
    expandedProfile.style.display = 'block';
}

// Function to close expanded profile view
function closeProfile() {
    const overlay = document.getElementById('overlay');
    const expandedProfile = document.getElementById('expanded-profile');

    overlay.style.display = 'none';
    expandedProfile.style.display = 'none';
}

// Function to send message (example action)
async function sendMessage() {
    alert('Sending a message...');

    closeProfile();
    let myProfileId = myProfile.id;
    let clickedProfileId = clickedProfile.id;

    let checkchat = await checkIfChatExists(myProfileId, clickedProfileId)
    if(checkchat !== false)
    {
        localStorage.setItem("currentchat", JSON.stringify(checkchat))
        window.location.replace("messages.html")
    }
    else
    {
        console.log(myProfileId)
        console.log(clickedProfileId)
        let theChat = await createChat(myProfileId, clickedProfileId);
        localStorage.setItem("currentchat", JSON.stringify(theChat))
        window.location.replace("messages.html")
    }
}

async function checkIfChatExists(from, to) {
    try {
        const response = await fetch(`http://localhost:8080/checkchat?from=${from}&to=${to}`);

        if (response.ok) {
            const chatExists = await response.json(); // Convert response body to JSON
            console.log('Chat existence checked successfully:', chatExists);
            return chatExists; // Return the result indicating whether the chat exists
        } else if (response.status === 404) {
            console.log('Chat does not exist.');
            return false; // Return false if the chat does not exist
        } else {
            throw new Error('Failed to check chat existence');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to check chat existence. Please try again later.');
    }
}

async function createChat(from, to) {
    const formData = new FormData();
    formData.append('from', from);
    formData.append('to', to);

    try {
        const response = await fetch('http://localhost:8080/createchat', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const chat = await response.json(); // Convert response body to JSON
            console.log('Chat created successfully:', chat);
            return chat; // Return the created chat object
        } else {
            throw new Error('Failed to create chat');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to create chat. Please try again later.');
    }
}


// Example usage:

// Function to like profile (example action)
function likeProfile() {
    alert('Liking the profile...');
    closeProfile();
}

// Dynamically create profile boxes
function populateProfilePage()
{
    profilesData.forEach(profile => {
        createProfileBox(profile);
    });
}
