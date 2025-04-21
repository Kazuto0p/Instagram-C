let profile_pic = "";

document.getElementById('profile_pic').addEventListener('change', async (e) => {
    const profile_pic_img = e.target.files[0];
    profile_pic = await convertBase64(profile_pic_img);
    document.getElementById('preview').innerHTML = `<img class="profile-preview" src="${profile_pic}" />`;
});

async function signUp(e) {
    e.preventDefault();

    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let password = document.getElementById('password').value;
    let c_password = document.getElementById('cpassword').value;

    // Regex for validation
    const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\(\d{3}\)\s?|\d{3}-?)\d{3}-?\d{4}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validation checks
    if (!usernameRegex.test(username)) {
        alert("Username must be 3-20 characters long and can only contain letters, numbers, underscores, and periods");
        return;
    }

    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return;
    }

    if (!phoneRegex.test(phone)) {
        alert("Please enter a valid phone number (e.g., 123-456-7890 or (123) 456-7890)");
        return;
    }

    if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
        return;
    }

    if (password !== c_password) {
        alert("Passwords do not match");
        return;
    }

    let data = { profile_pic, username, email, phone, password };

    let options = {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(data)
    };

    try {
        const response = await fetch('/api/signUp', options);
        const data = await response.json();

        console.log(data);

        if (response.status === 201) {
            alert(data.message);
            window.location.href = "/";
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.log(err);
        alert("An error occurred. Please try again.");
    }
}

// Function to convert image to base64
function convertBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = () => {
            reject(fileReader.error);
        };
    });
}