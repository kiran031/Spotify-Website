// Select the form once
const form = document.querySelector(".loginform");

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get input values
    const email1 = document.querySelector("#email").value;
    const password1 = document.querySelector("#password").value;

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append("email1", email1);
    formData.append("password1", password1);

    try {
        // Send POST request
        const response = await fetch("http://localhost:1234/SpotifyData/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        });

        if (!response.ok) {
            console.log(`Failed to send data: ${response.status}`);
            return;
        }

        // Parse server JSON
        const data = await response.json();
        console.log("Server response:", data);

        // Check login success
        if (data.data) {
            
            localStorage.setItem("loggedIn", "true");
            console.log("Login successful, redirecting now");

            // Use absolute path for reliable redirect

            // Optional: if you want to replace history
           window.location.href = "index.html"

             // stop further execution
        } else {
            alert("Username or password is incorrect");
        }

    } catch (e) {
        console.log("Error during login:", e);
    }

    // Reset the form safely
    form.reset();
});
