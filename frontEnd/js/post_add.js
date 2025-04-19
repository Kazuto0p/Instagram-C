let posts = [];

// Preview the selected images
document.getElementById('post').addEventListener('change', async (e) => {
    posts = [];
    const files = Array.from(e.target.files);
    const preview = document.getElementById('preview');
    preview.innerHTML = '';

    for (const file of files) {
        const base64 = await convertBase64(file);
        posts.push(base64);
        preview.innerHTML += `<img width="100px" height="auto" src="${base64}" alt="Preview" style="margin: 5px;" />`;
    }
});

async function addPost(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const userId = localStorage.getItem('id');

    if (!posts.length || !description || !userId) {
        alert("Please select at least one image, enter a description, and ensure you're logged in.");
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