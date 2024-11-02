/**
 * @typedef {{post_id: string, datetime: string, caption: string, file: string, username: string, platform: string, sfw: boolean}} Post
 * @typedef {{ x_pos: number, y_pos: number, angle: number, polaroid: HTMLDivElement, post: Post }} PostMeta
 */

//import 'animate.css';
const pillarUrl = '/images/pillar.png';
const pillarTopUrl = '/images/pillar_top.png';
const pillarBottomUrl = '/images/pillar_bottom.png';
const plantUrl = '/images/pflanze.svg';
const wavesUrl = '/images/animated-waves.svg';

const apiUrl = 'https://tmn.pxldeveloper.eu';
//const apiUrl = 'http://localhost:8000';

const app = document.querySelector('#app');

/**@type {Array<PostMeta>} */
let currentPosts = [];

const animations = [
  'animate__fadeInRight',
  'animate__fadeInLeft',
  'animate__fadeInBottomRight',
  'animate__fadeInBottomRight',
  'animate__fadeInBottomRight',
  'animate__fadeInTopLeft',
  'animate__fadeInTopRight',
];

/**
 * @returns {Array<Post>} posts
 */
async function fetchPosts() {
  const res = await fetch(apiUrl + '/pics');
  const posts = await res.json();
  return posts;
}

/**
 *
 * @param {PostMeta} post1
 * @param {PostMeta} post2
 * @returns {boolean} intersects
 */
function postsAreClose(post1, post2) {
  const post1Cords = {
    x: Math.round(post1.x_pos * window.innerWidth),
    y: Math.round(post1.y_pos * window.innerHeight),
  };

  const post2Cords = {
    x: Math.round(post2.x_pos * window.innerWidth),
    y: Math.round(post2.y_pos * window.innerHeight),
  };

  const distVector = [post1Cords.x - post2Cords.x, post1Cords.y - post2Cords.y];
  const distance = Math.round(
    Math.sqrt(Math.pow(distVector[0], 2) + Math.pow(distVector[1], 2))
  );

  console.log(distance);
  return distance < 55000;
}

/**
 *
 * @param {Post} post
 * @param {boolean} animate determense whether the created polaroid element should have an animation
 * @returns {PostMeta} enriched post
 */
function enrichPost(post, animate) {
  const angle = Math.round(Math.random() * 50 - 25);
  const y_pos = Math.round(Math.random() * 6) + 2;
  const x_pos = Math.round(Math.random() * 6) + 2;
  /** @type {PostMeta} */
  const postMeta = {
    x_pos,
    y_pos,
    angle,
    polaroid: document.createElement('div'),
    post: post,
  };

  console.log(postMeta);

  /*let fuckItCounter = 20;

  let closeToAny = currentPosts.some((otherPost) =>
    postsAreClose(otherPost, postMeta)
  );

  while (closeToAny && fuckItCounter > 0) {
    postMeta.x_pos = Math.round(Math.random() * 10);
    postMeta.y_pos = Math.round(Math.random() * 10);
    closeToAny = currentPosts.some((otherPost) =>
      postsAreClose(otherPost, postMeta)
    );
    console.log(postMeta);
    fuckItCounter--;
  }

  if (fuckItCounter == 0) {
    console.log('Fucked it');
  }*/

  if (animate) {
    const animationKey = Math.floor(Math.random() * animations.length);
    postMeta.polaroid.classList = `animate__animated ${animations[animationKey]}`;
    setTimeout(() => (postMeta.polaroid.classList = ''), 2000);
  }
  postMeta.polaroid.style.position = 'absolute';
  postMeta.polaroid.style.top = `${y_pos}0%`;
  postMeta.polaroid.style.left = `${x_pos}0%`;
  //postMeta.polaroid.style.top = `${}px`
  postMeta.polaroid.style.width = '20rem';
  postMeta.polaroid.style.zIndex = 200;
  //postMeta.polaroid.style.transform = 'translate(-50%, -50%)';
  postMeta.polaroid.innerHTML = `<sl-card class="card-overview">
  <img slot="image" src="${apiUrl + post.file}"/>
  <small>${
    post.platform === 'telegram' ? '📸 TMN Team' : `@${post.username}`
  }</small>
  </sl-card>`;

  /*postMeta.polaroid.classList = 'borderbox';
  postMeta.polaroid.style.transform = `rotate(${angle}deg)`;
  postMeta.polaroid.style.top = `${y_pos}%`;
  postMeta.polaroid.style.left = `${x_pos}%`;
  postMeta.polaroid.innerHTML = `<img style="width: 95%; border-radius: .5rem;" src="${
    apiUrl + post.file
  }" />${
    post.caption !== null && post.caption !== undefined
      ? `<br/><p class="subtitle">${post.caption}</p>`
      : ''
  }<br/><br/><small>${
    post.platform === 'telegram' ? '📸 TMN Team' : `@${post.username}`
  }</small>`;*/

  return postMeta;
}

/**
 *
 * @param {Array<Post>} posts
 * @returns {boolean} rerender flag which indicates whether something has changed.
 */
function calculateDiff(posts) {
  let somethingChanged = false;

  const isInitalLoad = currentPosts.length === 0;

  // Calculate the posts which need to be added and add them
  posts.forEach((post) => {
    const alreadyRendered = currentPosts.some(
      (currentPost) => currentPost.post.post_id === post.post_id
    );
    if (!alreadyRendered) {
      currentPosts.push(enrichPost(post, !isInitalLoad));
      console.log('Some post got added.');
      somethingChanged = true;
    }
  });

  // Calculate posts which nee to bee remove an remove them
  const previousLength = currentPosts.length;
  currentPosts = currentPosts.filter((currentPost) =>
    posts.some((post) => post.post_id === currentPost.post.post_id)
  );

  if (!somethingChanged) {
    somethingChanged = previousLength !== currentPosts.length;
    somethingChanged ? console.log('Some posts got removed.') : null;
  }
  return somethingChanged;
}

async function renderApplication() {
  const posts = await fetchPosts();
  const stateChanged = calculateDiff(posts);
  if (stateChanged) {
    app.innerHTML = '';
    console.log("Application's state has updated.");
    currentPosts.forEach((post) => {
      app.appendChild(post.polaroid);
    });
  }
}

renderApplication();
setInterval(() => {
  renderApplication();
}, 10000);
