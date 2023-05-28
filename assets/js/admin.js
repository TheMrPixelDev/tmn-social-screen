/**
 * @typedef {{post_id: string, datetime: string, caption: string, file: string, username: string, platform: string, sfw: boolean}} Post
 */

/**
 * @type {HTMLDivElement}
 */
const app = document.getElementById('app');

//const apiUrl = 'http://localhost:8000';
const apiUrl = 'https://tmn.pxldeveloper.eu';

async function fetchPosts() {
  const res = await fetch(apiUrl + '/pics/all', {
    credentials: 'include',
  });
  const posts = await res.json();
  return posts;
}

async function triggerServersideRefetch() {
  alert('Requesting new refetch');
  const res = await fetch(apiUrl + '/fetch_new_pics', {
    credentials: 'include',
  });
  const posts = await res.json();
  await renderPosts(posts);
  alert('Post have been refetched');
}

/**
 *
 * @param {boolean} isSfw
 * @param {string} postId
 */
async function updateSfwStatus(isSfw, postId) {
  const res = await fetch(
    apiUrl + `/set_sfw_status?post_id=${postId}&sfw_status=${isSfw}`,
    {
      method: 'PUT',
      credentials: 'include',
    }
  );
  if (res.ok) {
    renderPosts();
  }
}

/**
 *
 * @param {Post} post
 * @param {HTMLButtonElement} button
 */
const updateButton = (post, button) => {
  if (post.sfw) {
    button.innerText = 'verstecken';
    button.classList = 'green-btn';
    button.onclick = () => {
      updateSfwStatus(false, post.post_id);
    };
  } else {
    button.onclick = () => {
      updateSfwStatus(true, post.post_id);
    };
    button.classList = 'red-btn';
    button.innerText = 'anzeigen';
  }
};

/**
 *
 * @param {Post} post
 * @returns {HTMLDivElement}
 */
const createPostElement = (post) => {
  const box = document.createElement('div');
  const img = document.createElement('img');
  const allowButton = document.createElement('button');
  updateButton(post, allowButton);
  img.src = apiUrl + post.file;
  box.classList = 'box';
  box.appendChild(img);
  box.appendChild(allowButton);
  return box;
};

/**
 * @param {Array<Post>} posts
 * @returns {void}
 */
async function renderPosts(posts) {
  let postsToRender = posts;

  if (postsToRender === undefined) {
    postsToRender = await fetchPosts();
  }

  document.getElementById('refetch-posts-button').disabled = false;

  postsToRender.sort(
    (post1, post2) => parseInt(post2.datetime) - parseInt(post1.datetime)
  );

  app.innerHTML = '';
  postsToRender.forEach((post) => {
    app.appendChild(createPostElement(post));
  });
}

/** Execution starts here */
renderPosts();
