async function reset_password(event) {
    event.preventDefault();

    const password = document.getElementById("password").value;
    const cpassword = document.getElementById("cpassword").value;
    const email = localStorage.getItem("email");

    if (!email) {
        alert("No email found. Please start the password reset process again.");
        window.location.href = "/forgot-password.html"; 
        return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*).");
        return;
    }

    if (password !== cpassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    const data = { email, password };

    const options = {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(data)
    };

    try {
        const response = await fetch("/api/pass_reset", options);
        const responseData = await response.json();

        if (response.status === 201 || response.status === 200) {
            alert(responseData.message || "Password reset successfully!");
            localStorage.clear();
            window.location.href = "/login.html";
        } else {
            alert(responseData.message || "Failed to reset password. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while resetting the password. Please try again later.");
    }
}