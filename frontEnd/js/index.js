async function loadPosts() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/loadPosts", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        console.log("Response JSON:", data.posts, data.userData._id);

        if (response.status === 200) {
            localStorage.setItem("id", data.userData._id);
            let str = "";
            const userId = data.userData._id; // Current user's ID

            let reversed = data.posts.reverse();

            reversed.forEach((element, index) => {
                const isLiked = element.likes.includes(userId); // Check if user liked the post
                const likeCount = element.likeCount || element.likes.length; // Use likeCount or fallback to likes.length

                if (Array.isArray(element.post) && element.post.length > 1) {
                    let slides = element.post
                        .map(
                            (img) => `
                  <div class="swiper-slide">
                    <img src="${img || "default.jpg"}" alt="Post Image" />
                  </div>
                `
                        )
                        .join("");

                    str += `
              <div class="post-section" data-post-id="${element._id}">
                <div class="post-header">
                  <img src="${element.user?.profile_pic || "default.jpg"}" alt="User" />
                  <strong>${element.user?.username || "Unknown"}</strong>
                </div>
                <div class="swiper" id="swiper-${index}">
                  <div class="swiper-wrapper">
                    ${slides}
                  </div>
                  <div class="swiper-button-prev"></div>
                  <div class="swiper-button-next"></div>
                  <div class="swiper-pagination"></div>
                </div>
                <div id="btn-3">
                <div id="box">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="33"
                    height="33"
                    class="heart-icon loveIcon ${isLiked ? "liked" : ""}"
                    stroke="red"
                    stroke-width="2"
                    fill="${isLiked ? "red" : "none"}"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-post-id="${element._id}"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span class="like-count">${likeCount}</span>
                </div>
                  <a class="comment-btn">🗨️</a>
                  <a class="share-btn"><img src="images/instagram-share-icon.svg" alt="Share" /></a>
                </div>
                <div class="post-description">
                  ${element.description}
                </div>
              </div>
            `;
                } else {
                    const image = Array.isArray(element.post) ? element.post[0] : element.post;
                    str += `
              <div class="post-section" data-post-id="${element._id}">
                <div class="post-header">
                  <img src="${element.user?.profile_pic || "default.jpg"}" alt="User" />
                  <strong>${element.user?.username || "Unknown"}</strong>
                </div>
                <img class="post-image" src="${image || "default.jpg"}" alt="Post Image" />
                <div id="btn-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="33"
                    height="33"
                    class="heart-icon loveIcon ${isLiked ? "liked" : ""}"
                    stroke="red"
                    stroke-width="2"
                    fill="${isLiked ? "red" : "none"}"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-post-id="${element._id}"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span class="like-count">${likeCount}</span>
                  <a class="comment-btn">💬</a>
                  <a class="share-btn"><img src="images/instagram-share-icon.svg" alt="Share" /></a>
                </div>
                <div class="post-description">
                  ${element.description}
                </div>
              </div>
            `;
                }
            });

            profile_pic.src = data.userData.profile_pic;
            posts.innerHTML = str;
            username.textContent = `Welcome ${data.userData.username}`;

            // Initialize Swiper for posts with multiple images
            data.posts.forEach((element, index) => {
                if (Array.isArray(element.post) && element.post.length > 1) {
                    new Swiper(`#swiper-${index}`, {
                        loop: true,
                        navigation: {
                            nextEl: `.swiper-button-prev`,
                            prevEl: `.swiper-button-next`,
                        },
                        pagination: {
                            el: `.swiper-pagination`,
                            clickable: true,
                        },
                    });
                }
            });

            // Add click event listeners to heart icons
            document.querySelectorAll(".heart-icon").forEach((heart) => {
                heart.addEventListener("click", async () => {
                    const postId = heart.getAttribute("data-post-id");
                    // console.log(postId);
                    
                    const isLiked = heart.classList.contains("liked");
                    // console.log(isLiked);
                    

                    try {
                        const response = await fetch(`http://localhost:8080/api/like/${postId}`, {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ userId }), // Send userId in body
                        });

                        const result = await response.json();
                        if (response.status === 200) {
                            const likeCountElement = heart.nextElementSibling; // The <span> with like count
                            if (isLiked) {
                                // Unlike
                                heart.classList.remove("liked");
                                heart.setAttribute("fill", "none");
                                likeCountElement.textContent = parseInt(likeCountElement.textContent) - 1;
                            } else {
                                // Like
                                heart.classList.add("liked");
                                heart.setAttribute("fill", "red");
                                likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;
                            }
                        } else {
                            console.error("Error updating like:", result.message);
                            alert("Failed to update like");
                        }
                    } catch (err) {
                        console.error("Error:", err);
                        alert("An error occurred");
                    }
                });
            });

           
            document.querySelectorAll(".post-image, .swiper-slide img").forEach((image) => {
                image.addEventListener("dblclick", async () => {
                    const postSection = image.closest(".post-section");
                    const postId = postSection.getAttribute("data-post-id");
                    const heart = postSection.querySelector(".heart-icon");
                    const isLiked = heart.classList.contains("liked");

                    if (!isLiked) {
                        // Only trigger like on double-tap if not already liked
                        try {
                            const response = await fetch(`http://localhost:8080/api/like/${postId}`, {
                                method: "POST",
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ userId: localStorage.getItem("id") }),
                            });

                            const result = await response.json();
                            if (response.status === 200) {
                                heart.classList.add("liked");
                                heart.setAttribute("fill", "red");
                                const likeCountElement = heart.nextElementSibling;
                                likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;

                                // Show like animation
                                const animation = document.createElement("div");
                                animation.className = "like-animation";
                                animation.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" height="60" fill="red">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  `;
                                postSection.appendChild(animation);
                                setTimeout(() => animation.remove(), 800);
                            } else {
                                alert("Failed to like post");
                            }
                        } catch (err) {
                            console.error("Error:", err);
                            alert("An error occurred");
                        }
                    }
                });
            });
        } else {
            console.error("Invalid response structure:", data);
            window.location.href = "/login.html";
        }
    } catch (err) {
        console.log("Error:", err);
        window.location.href = "/login.html";
    }
}

function signout() {
    alert("Signing Out");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    window.location.href = "/login.html";
}

loadPosts();