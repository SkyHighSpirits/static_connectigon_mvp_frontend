document.getElementById('sign_up_form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const form = event.target;
    const formData = new FormData(form);

    fetch('http://localhost:8080/register', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                alert('Profile created successfully!');
                form.reset(); // Reset form fields
                window.location.replace("login.html")
            } else {
                throw new Error('Failed to create profile');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to create profile. Please try again later.');
        });
});