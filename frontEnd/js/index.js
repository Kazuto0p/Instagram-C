let posts = document.getElementById('posts');
let username = document.getElementById('username');
let profile_pic = document.getElementById('profile_pic');

async function loadPosts() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/loadPosts?_=" + Date.now(), {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (response.status === 200 && data.posts && Array.isArray(data.posts)) {
            localStorage.setItem('id', data.userData._id);
            let str = "";

            // Log original posts order
            console.log("Original posts order:", data.posts.map(p => ({
                id: p._id,
                description: p.description,
                createdAt: p.createdAt
            })));

            // Sort posts: newest last in API, so reverse
            let sortedPosts = [...data.posts].reverse();
            console.log("Reversed posts:", sortedPosts.map(p => ({
                id: p._id,
                description: p.description,
                createdAt: p.createdAt
            })));

            if (sortedPosts.length === 0) {
                posts.innerHTML = '<p>No posts available.</p>';
                return;
            }

            sortedPosts.forEach((element, index) => {
                console.log(`Rendering post ${index}:`, {
                    id: element._id,
                    description: element.description,
                    createdAt: element.createdAt
                });
                str += `
                    <div class="post-section">
                        <div class="post-header">
                            <img
                                src="${element.user?.profile_pic || 'default.jpg'}"
                                alt="User"
                            />
                            <strong>${element.user?.username || 'Unknown'}</strong>
                        </div>
                  
                        <img
                            class="post-image"
                            src="${element.post?.[0] || 'default.jpg'}"
                            alt="Post Image"
                        />
                  
                        <div class="post-description">
                            ${element.description || 'No description'}
                        </div>
                    </div>
                `;
            });

            profile_pic.src = data.userData.profile_pic || 'default.jpg';
            posts.innerHTML = str;
            username.textContent = `Welcome ${data.userData.username || 'User'}`;
        } else {
            console.error('Invalid response:', response.status, data);
            window.location.href = '/login.html';
        }

    } catch (err) {
        console.error('Error:', err);
        window.location.href = '/login.html';
    }
}

loadPosts();

// Signout function
function signout() {
    alert("Signing Out");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    window.location.href = "/login.html";
}