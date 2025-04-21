let username = document.getElementById('username');
let num_posts = document.getElementById('num_posts');
let under_name = document.getElementById('under_name');
let profile_pic = document.getElementById('profile_pic');
let posts = document.getElementById('posts');
let modal = document.getElementById('imageModal');
let modalContent = document.getElementById('modalContent');
let str = '';
let id = localStorage.getItem('id');
let postData = [];

async function loadProfile() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in');
      window.location.href = '/login.html';
      return;
    }

    // Fetch user data
    const response1 = await fetch(`http://localhost:8080/api/getUser/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data1 = await response1.json();

    username.textContent = data1.username;
    under_name.textContent = data1.username;
    profile_pic.src = data1.profile_pic;

    // Fetch posts
    const response2 = await fetch(`http://localhost:8080/api/getPost/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data2 = await response2.json();

    // Reverse posts to show latest first
    let reverse_data2 = data2.reverse();
    postData = reverse_data2;

    str = '';
    reverse_data2.forEach((element, index) => {
      const isLiked = element.likes.includes(id);
      const likeCount = element.likeCount || element.likes.length;

      // Handle multiple images
      if (Array.isArray(element.post) && element.post.length > 1) {
        let slides = element.post
          .map(
            (img) => `
              <div class="swiper-slide">
                <img src="${img || 'default.jpg'}" alt="Post Image" />
              </div>
            `
          )
          .join('');
        str += `
          <div class="post-container" data-post-id="${element._id}" onclick="openModal(${index})">
            <div class="swiper" id="swiper-${index}">
              <div class="swiper-wrapper">
                ${slides}
              </div>
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
              <div class="swiper-pagination"></div>
            </div>
            <div class="post-actions">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                class="heart-icon loveIcon ${isLiked ? 'liked' : ''}"
                stroke="red"
                stroke-width="2"
                fill="${isLiked ? 'red' : 'none'}"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-post-id="${element._id}"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span class="like-count">${likeCount}</span>
              <a class="comment-btn" href="javascript:void(0)" onclick="openComment('${element._id}'); event.stopPropagation();">💬</a>
              <a class="share-btn" href="javascript:void(0)" onclick="sharePost('${element._id}'); event.stopPropagation();">
                <img src="images/instagram-share-icon.svg" alt="Share" />
              </a>
              <button class="delete-post" onclick="del('${element._id}'); event.stopPropagation();">Delete</button>
            </div>
          </div>
        `;
      } else {
        const image = Array.isArray(element.post) ? element.post[0] : element.post;
        str += `
          <div class="post-container" data-post-id="${element._id}" onclick="openModal(${index})">
            <img src="${image || 'default.jpg'}" class="post-image" alt="Post Image" />
            <div class="post-actions">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                class="heart-icon loveIcon ${isLiked ? 'liked' : ''}"
                stroke="red"
                stroke-width="2"
                fill="${isLiked ? 'red' : 'none'}"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-post-id="${element._id}"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span class="like-count">${likeCount}</span>
              <a class="comment-btn" href="javascript:void(0)" onclick="openComment('${element._id}'); event.stopPropagation();">💬</a>
              <a class="share-btn" href="javascript:void(0)" onclick="sharePost('${element._id}'); event.stopPropagation();">
                <img src="images/instagram-share-icon.svg" alt="Share" />
              </a>
              <button class="delete-post" onclick="del('${element._id}'); event.stopPropagation();">Delete</button>
            </div>
          </div>
        `;
      }
    });

    posts.innerHTML = str;
    num_posts.textContent = postData.length;

    // Initialize Swiper for multi-image posts
    postData.forEach((element, index) => {
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

    setupPostInteractions();
  } catch (err) {
    console.log('Error:', err);
    alert('Error loading profile');
  }
}

function openModal(index) {
  const element = postData[index];
  const isLiked = element.likes.includes(id);
  const likeCount = element.likeCount || element.likes.length;

  let modalHtml = '';
  if (Array.isArray(element.post) && element.post.length > 1) {
    let slides = element.post
      .map(
        (img) => `
          <div class="swiper-slide">
            <img src="${img || 'default.jpg'}" class="modal-single-image" alt="Post Image" />
          </div>
        `
      )
      .join('');
    modalHtml = `
      <div class="swiper" id="modal-swiper">
        <div class="swiper-wrapper">
          ${slides}
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-pagination"></div>
      </div>
    `;
  } else {
    const image = Array.isArray(element.post) ? element.post[0] : element.post;
    modalHtml = `
      <img src="${image || 'default.jpg'}" class="modal-single-image" alt="Post Image" />
    `;
  }

  modalContent.innerHTML = `
    ${modalHtml}
    <div class="modal-actions">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        class="heart-icon loveIcon ${isLiked ? 'liked' : ''}"
        stroke="red"
        stroke-width="2"
        fill="${isLiked ? 'red' : 'none'}"
        stroke-linecap="round"
        stroke-linejoin="round"
        data-post-id="${element._id}"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <span class="like-count">${likeCount}</span>
      <a class="comment-btn" href="javascript:void(0)" onclick="openComment('${element._id}')">💬</a>
      <a class="share-btn" href="javascript:void(0)" onclick="sharePost('${element._id}')">
        <img src="images/instagram-share-icon.svg" alt="Share" />
      </a>
    </div>
  `;

  modal.style.display = 'flex';

  // Initialize Swiper for modal if multiple images
  if (Array.isArray(element.post) && element.post.length > 1) {
    new Swiper('#modal-swiper', {
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

  // Re-attach like event listener for modal
  const modalHeart = modalContent.querySelector('.heart-icon');
  modalHeart.addEventListener('click', async () => {
    await handleLike(modalHeart);
  });
}

function closeModal() {
  modal.style.display = 'none';
  modalContent.innerHTML = '';
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

async function setupPostInteractions() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in');
    window.location.href = '/login.html';
    return;
  }

  // Like button click
  document.querySelectorAll('.post-container .heart-icon').forEach((heart) => {
    heart.addEventListener('click', async (e) => {
      e.stopPropagation();
      await handleLike(heart);
    });
  });

  // Double-tap to like
  document.querySelectorAll('.post-image, .swiper-slide img').forEach((image) => {
    image.addEventListener('dblclick', async (e) => {
      e.stopPropagation();
      const postContainer = image.closest('.post-container');
      const postId = postContainer.getAttribute('data-post-id');
      const heart = postContainer.querySelector('.heart-icon');
      const isLiked = heart.classList.contains('liked');

      if (!isLiked) {
        try {
          const response = await fetch(`http://localhost:8080/api/like/${postId}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: id }),
          });

          const result = await response.json();
          if (response.status === 200) {
            heart.classList.add('liked');
            heart.setAttribute('fill', 'red');
            const likeCountElement = heart.nextElementSibling;
            likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;

            // Show like animation
            const animation = document.createElement('div');
            animation.className = 'like-animation';
            animation.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" height="60" fill="red">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            `;
            postContainer.appendChild(animation);
            setTimeout(() => animation.remove(), 800);
          } else {
            alert('Failed to like post: ' + result.message);
          }
        } catch (err) {
          console.error('Error:', err);
          alert('An error occurred');
        }
      }
    });
  });
}

async function handleLike(heart) {
  const token = localStorage.getItem('token');
  const postId = heart.getAttribute('data-post-id');
  const isLiked = heart.classList.contains('liked');

  try {
    const response = await fetch(`http://localhost:8080/api/like/${postId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: id }),
    });

    const result = await response.json();
    if (response.status === 200) {
      const likeCountElement = heart.nextElementSibling;
      if (isLiked) {
        heart.classList.remove('liked');
        heart.setAttribute('fill', 'none');
        likeCountElement.textContent = parseInt(likeCountElement.textContent) - 1;
      } else {
        heart.classList.add('liked');
        heart.setAttribute('fill', 'red');
        likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;
      }
      // Sync like state
      const gridHeart = document.querySelector(`.post-container[data-post-id="${postId}"] .heart-icon`);
      const modalHeart = modalContent.querySelector(`.heart-icon[data-post-id="${postId}"]`);
      [gridHeart, modalHeart].forEach((h) => {
        if (h) {
          h.classList.toggle('liked', !isLiked);
          h.setAttribute('fill', isLiked ? 'none' : 'red');
          h.nextElementSibling.textContent = likeCountElement.textContent;
        }
      });
    } else {
      alert('Failed to update like: ' + result.message);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('An error occurred');
  }
}

function openComment(postId) {
  alert(`Open comments for post ID: ${postId}`);
}

function sharePost(postId) {
  const postUrl = `${window.location.origin}/post/${postId}`;
  navigator.clipboard.writeText(postUrl).then(() => {
    alert('Post URL copied to clipboard!');
  }).catch((err) => {
    console.error('Error copying URL:', err);
    alert('Failed to copy URL');
  });
}

function editProfile() {
  window.location.href = 'edProfile.html';
}

async function deleteProfile() {
  try {
    const confirmDelete = confirm('Are you sure you want to Delete your Profile?');
    if (!confirmDelete) {
      return;
    }
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/deleteProfile/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      alert('Profile Deleted Successfully');
      localStorage.clear();
      window.location.href = '/';
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.log(err);
    alert('Error deleting profile');
  }
}

async function del(postId) {
  try {
    const confirmDelete = confirm('Are you sure you want to delete your post?');
    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem('token');
    console.log('Deleting postId:', postId);
    console.log('Token:', token);
    if (!token) {
      alert('Please log in');
      window.location.href = '/login.html';
      return;
    }

    const url = `http://localhost:8080/api/sdel/${postId}`;
    console.log('Request URL:', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (response.status === 200) {
      alert('Post deleted successfully');
      loadProfile();
    } else {
      alert(data.message || 'Error deleting post');
    }
  } catch (err) {
    console.log('Error:', err);
    alert('Error deleting post');
  }
}

function signout() {
  localStorage.clear();
  alert('Logging out');
  window.location.href = '/';
}

loadProfile();