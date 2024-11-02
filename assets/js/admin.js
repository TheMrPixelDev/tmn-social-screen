/**
 * @typedef {{post_id: string, datetime: string, caption: string, file: string, username: string, platform: string, sfw: boolean}} Post
 */

/**
 * @type {HTMLDivElement}
 */
const app = document.getElementById('app');

//const apiUrl = 'http://localhost:8000';
const apiUrl = 'https://tmn.pxldeveloper.eu';

/**
 *
 * @param {string} html
 * @returns {string} escaped html
 */
function escapeHtml(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 *
 * @param {string} message
 */
function showNotification(message) {
  const notification = document.getElementById('notification-alert');
  notification.innerHTML = `<sl-icon name="info-circle" slot="icon"></sl-icon>${escapeHtml(
    message
  )}`;
  notification.open = true;
}

async function fetchPosts() {
  const res = await fetch(apiUrl + '/pics/all', {
    credentials: 'include',
  });
  const posts = await res.json();
  return posts;
}

/**
 * @param {string} postId
 * @returns {Promise}
 */
async function deletePost(postId) {
  const res = await fetch(apiUrl + `/pic?post_id=${postId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return await res.json();
}

async function triggerServersideRefetch() {
  const refetchButton = document.getElementById('refetch-posts-button');
  refetchButton.innerHTML = `<sl-spinner slot="suffix"></sl-spinner>Refetch`;
  showNotification('Neue Postings werden gesucht...');
  const res = await fetch(apiUrl + '/fetch_new_pics', {
    credentials: 'include',
  });
  const posts = await res.json();
  await renderPosts(posts);
  refetchButton.innerHTML = `<sl-icon slot="suffix" name="arrow-counterclockwise"></sl-icon>Refetch`;
  showNotification('Suche nach neuen Postings abgeschlossen.');
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
    button.innerHTML =
      '<sl-icon name="eye-slash" margin="1rem"></sl-icon><span slot="suffix">verstecken</span>';
    button.classList = 'green-btn';
    button.onclick = () => {
      button.innerHTML = `<sl-spinner slot="prefix" style="--track-width: 3px; --indicator-color: black"></sl-spinner>anzeigen`;
      updateSfwStatus(false, post.post_id);
    };
  } else {
    button.onclick = () => {
      button.innerHTML = `<sl-spinner slot="prefix" style="--track-width: 3px; --indicator-color: black"></sl-spinner>verstecken`;
      updateSfwStatus(true, post.post_id);
    };
    button.classList = 'red-btn';
    button.innerHTML =
      '<sl-icon name="eye"></sl-icon><span slot="suffix">anzeigen</span>';
  }
};

/**
 *
 * @param {Post} post
 */
function openTextDialog(post) {
  const dialog = document.getElementById('post-more-dialog');
  const date = new Date(parseInt(post.datetime) * 1000);
  dialog.label =
    post.username +
    ` am ${date.getDay()}.${date.getMonth()}.${date.getFullYear()} um ${date.getHours()}:${date.getMinutes()}`;
  dialog.innerText =
    post.caption !== undefined && post.caption !== null
      ? post.caption
      : 'Kein Text vorhanden';
  dialog.show();
}

/**
 *
 * @param {Post} post
 * @returns {HTMLDivElement}
 */
const createPostElement = (post) => {
  const box = document.createElement('div');
  const date = new Date(parseInt(post.datetime) * 1000);
  box.classList = 'post-box';
  box.innerHTML = `<sl-card class="card-overview">
  <img slot="image" src="${apiUrl + post.file}"/>
  <div><sl-icon name="person"></sl-icon> ${post.username}</div>
  <div><sl-icon name="clock"></sl-icon> ${date.getDay()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}</div>
  <div slot="footer">
  <sl-button variant="${
    post.sfw ? 'success' : 'danger'
  }" class="hs-button"></sl-button>
  <sl-button variant="info" class="more-button">mehr</sl-button>
  <sl-button variant="danger" class="delete-button"><sl-icon name="trash"></sl-icon></sl-button>
  </div>
  </sl-card>`;
  const button = box.querySelector('.hs-button');
  box
    .querySelector('.more-button')
    .addEventListener('click', () => openTextDialog(post));
  updateButton(post, button);
  box.querySelector('.delete-button').addEventListener('click', () => {
    deletePost(post.post_id)
      .then(() =>
        showNotification(
          `Post ${post.post_id} von ${post.username} wurde erfolgreich gelöscht.`
        )
      )
      .catch(() =>
        showNotification(
          `Beim Löschen des Posts ${post.post_id} von ${post.username} ist ein Fehler aufgetreten.`
        )
      );
  });
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
