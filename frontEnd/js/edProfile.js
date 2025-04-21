// Get all the input fields using id from HTML
let preview = document.getElementById('preview');
let username = document.getElementById('username');
let email = document.getElementById('email');
let phone = document.getElementById('phone');

const id = localStorage.getItem('id');

let profile_pic = "";
document.getElementById('profile_pic').addEventListener('change', async (e) => {
    const profile_pic_img = e.target.files[0];

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!profile_pic_img || !validImageTypes.includes(profile_pic_img.type)) {
        alert('Please upload a valid image (JPEG, PNG, or GIF).');
        return;
    }

    profile_pic = await convertBase64(profile_pic_img);
    document.getElementById('preview').innerHTML = `<img class="profile-preview" src="${profile_pic}" />`;
});

// Load the user data in edit initially
async function loadUser() {
    if (!id) {
        alert("User ID not found. Please log in.");
        return;
    }

    try {
        const response = await fetch(`/api/getUser/${id}`);
        const data = await response.json();

        console.log(data);

        preview.innerHTML = `<img class="profile-preview" src="${data.profile_pic}" />`;
        username.value = data.username;
        email.value = data.email;
        phone.value = data.phone;
        profile_pic = data.profile_pic;
    } catch (err) {
        console.error(err);
        alert("Error loading user data");
    }
}

// Call the function loadUser
loadUser();

async function signUp(e) {
    e.preventDefault();

    const usernameVal = username.value.trim();
    const emailVal = email.value.trim();
    const phoneVal = phone.value.trim();

    // Regex validations
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

    // Validate inputs
    if (!profile_pic) {
        alert("Please select a profile picture.");
        return;
    }

    if (!usernameRegex.test(usernameVal)) {
        alert("Username must be 3-20 characters long and contain only letters, numbers, underscores, or hyphens.");
        return;
    }

    if (!emailRegex.test(emailVal)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!phoneRegex.test(phoneVal)) {
        alert("Please enter a valid phone number (e.g., (123) 456-7890, 123-456-7890, or 1234567890).");
        return;
    }

    if (!id) {
        alert("User ID not found. Please log in.");
        return;
    }

    let data = { profile_pic, username: usernameVal, email: emailVal, phone: phoneVal };

    let options = {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(data)
    };

    try {
        const response = await fetch(`/api/editUser/${id}`, options);
        const data = await response.json();

        if (response.status === 200) {
            alert(data.message);
            window.location.href = "/profile.html";
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Error updating profile");
    }
}

// Function to convert image to base64
function convertBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.onerror = () => reject(fileReader.error);
    });
}