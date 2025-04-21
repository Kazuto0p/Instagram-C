let posts = [];

// Preview the selected images
document.getElementById('post').addEventListener('change', async (e) => {
    posts = [];
    const files = Array.from(e.target.files);
    const preview = document.getElementById('preview');
    preview.innerHTML = '';

    // Validate file types
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    for (const file of files) {
        if (!validImageTypes.includes(file.type)) {
            alert(`Invalid file type: ${file.name}. Please upload JPEG, PNG, or GIF images only.`);
            continue;
        }

        const base64 = await convertBase64(file);
        posts.push(base64);
        // Prepend the new image to make the last added image appear first
        preview.innerHTML = `<img width="100px" height="auto" src="${base64}" alt="Preview" style="margin: 5px;" />` + preview.innerHTML;
    }
});

async function addPost(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const userId = localStorage.getItem('id');

    // Regex for description: letters, numbers, spaces, and allowed punctuation
    const descriptionRegex = /^[a-zA-Z0-9\s.,!?'\-"#@]{3,500}$/;
    
    // Validate inputs
    if (!posts.length) {
        alert("Please select at least one image.");
        return;
    }
    
    if (!descriptionRegex.test(description)) {
        alert("Description must be 3-500 characters long and contain only letters, numbers, spaces, and these characters: .,!?'-\"#@");
        return;
    }
    
    if (!userId) {
        alert("Please ensure you're logged in.");
        return;
    }

    const payload = { post: posts, description };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
    };

    try {
        const response = await fetch(`/api/addPost/${userId}`, options);
        const data = await response.json();

        if (response.status === 201) {
            alert(data.message);
            window.location.href = "/index.html";
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Error uploading post');
    }
}

// Utility to convert file → Base64 string
function convertBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
    });
}