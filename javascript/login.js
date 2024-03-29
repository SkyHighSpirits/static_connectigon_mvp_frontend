document.getElementById('log-in-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const form = event.target;
    const formData = new FormData(form);

    fetch('http://localhost:8080/login', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                alert('Logged in successfully!');
                form.reset(); // Reset form fields
                return response.json(); // Convert response body to JSON
            } else {
                throw new Error('Failed to log in');
            }
        })
        .then(data => {
            // Store the returned object in localStorage
            localStorage.setItem("currentuser", JSON.stringify(data));
            window.location.replace("explore.html");
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to login. Please try again later.');
        });
});