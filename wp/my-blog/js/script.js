let posts = JSON.parse(localStorage.getItem('posts')) || [];
let filteredPosts = posts;

document.getElementById('add-post-button').addEventListener('click', addPost);
document.getElementById('search-button').addEventListener('click', searchByKeyword);
document.getElementById('show-all-posts-button').addEventListener('click', showAllPosts);

function addPost() {
    let content = document.getElementById('post-content').value;
    let keywords = document.getElementById('post-keywords').value;
    let image = document.getElementById('post-image').files[0];

    if (!content) {
        alert("post content cannot be empty");
        return;
    }

    let post = {
        id: Date.now(),
        content: content,
        keywords: keywords.split(' ').filter(word => word.startsWith('#')),
        date: new Date().toISOString(),
        image: image ? URL.createObjectURL(image) : null
    };

    posts.push(post);
    posts.sort(function(a, b) { return new Date(b.date) - new Date(a.date) });
    localStorage.setItem('posts', JSON.stringify(posts));
    filteredPosts = posts;
    displayPosts();
    clearForm();
}

function displayPosts() {
    let postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';

    filteredPosts.forEach(function(post) {
        let postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <p>${post.content}</p>
            ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image"/>` : ''}
            <p class="post-keywords">${post.keywords.map(function(keyword) { return `<a href="#" onclick="filterByKeyword('${keyword}')">${keyword}</a>` }).join(' ')}</p>
            <p><small>${new Date(post.date).toLocaleString()}</small></p>
        `;
        postsContainer.appendChild(postElement);
    });

    document.getElementById('show-all-posts-button').style.display = (filteredPosts.length < posts.length) ? 'block' : 'none';
}

function clearForm() {
    document.getElementById('post-content').value = '';
    document.getElementById('post-keywords').value = '';
    document.getElementById('post-image').value = '';
}

function filterByKeyword(keyword) {
    filteredPosts = posts.filter(function(post) {
        return post.keywords.includes(keyword);
    });
    displayPosts();
}

function searchByKeyword() {
    let keyword = document.getElementById('search-keyword').value.trim();
    if (keyword) {
        filteredPosts = posts.filter(function(post) {
            return post.keywords.includes(keyword);
        });
        displayPosts();
    }
}

function showAllPosts() {
    filteredPosts = posts;
    displayPosts();
}

window.onload = displayPosts;
