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

/**
 * Render non dynamical dom elemennts (plant, bubbles, pillar)
 */
function renderDecoration() {
  const decorations = document.getElementById('decorations');
  const wrapper = document.createElement('div');
  wrapper.classList = 'wrapper';
  for (var i = 0; i < 20; i++) {
    const bubbleContainer = document.createElement('div');
    const bubble = document.createElement('span');
    bubble.classList = 'dot';
    const x = Math.round(Math.random() * 10) * 10;
    const y = Math.round(Math.random() * 10) * 10;
    const animationLength = Math.round(Math.random() * 10) + 3;
    //const radius = Math.round(Math.random() * 3);
    bubbleContainer.style.top = y + '%';
    bubbleContainer.style.left = x + '%';
    bubbleContainer.style.animation = `bubbleAnimation ${animationLength}s linear infinite`;
    //bubble.style.width = radius + "rem";
    //bubble.style.height = radius + "rem";
    //bubble.classList.add("bubble");
    bubbleContainer.appendChild(bubble);
    wrapper.appendChild(bubbleContainer);
  }
  decorations.appendChild(wrapper);

  const plant = document.createElement('img');
  const plant2 = document.createElement('img');
  plant.classList = 'plant';
  plant2.classList = 'plant';
  plant.style.animation = 'plantAnimation 20s linear infinite';
  plant2.style.animation = 'plantAnimation 15s linear infinite';
  plant2.src = plantUrl;
  plant.src = plantUrl;
  plant.style.height = '25rem';
  plant.style.position = 'absolute';
  plant.style.bottom = '-15px';

  plant2.style.height = '20rem';
  plant2.style.position = 'absolute';
  plant2.style.bottom = '-15px';
  plant2.style.right = '-1rem';
  plant2.style.transform = 'scaleX(-1)';
  plant2.style.zIndex = '1000';
  decorations.appendChild(plant);
  decorations.appendChild(plant2);

  //const waves = document.createElement('img');
  //waves.src = wavesUrl;
  //waves.style.position = 'absolute';
  //app.appendChild(waves);

  const pillarTop = document.createElement('img');
  const pillarBottom = document.createElement('img');
  const pillar = document.createElement('img');
  pillarTop.src = pillarTopUrl;
  pillarBottom.src = pillarBottomUrl;
  pillar.src = pillarUrl;
  /** Position pillar absolute */
  pillarTop.style.position = 'absolute';
  pillarBottom.style.position = 'absolute';
  pillar.style.position = 'absolute';
  /** Position right*/
  pillarTop.style.right = '-5px';
  pillarBottom.style.right = '-5px';
  pillar.style.right = '-5px';
  /** Position bottom */
  pillarTop.style.top = '-8px';
  pillarBottom.style.bottom = '0rem';
  pillar.style.bottom = '1rem';
  /** Dimensions */
  pillarTop.style.height = '5.5rem';
  pillarBottom.style.height = '4rem';
  pillar.style.height = '100%';
  pillar.style.width = '7rem';
  /** Append to main element */
  decorations.appendChild(pillar);
  decorations.appendChild(pillarBottom);
  decorations.appendChild(pillarTop);
}

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
 * @param {Post} post
 * @returns {PostMeta} enriched post
 */
function enrichPost(post) {
  const angle = Math.round(Math.random() * 50 - 25);
  const y_pos = 10 + Math.round(Math.random() * 20 - 10);
  const x_pos = 40 + Math.round(Math.random() * 50 - 25);
  /** @type {PostMeta} */
  const postMeta = {
    x_pos,
    y_pos,
    angle,
    polaroid: document.createElement('div'),
    post: post,
  };
  postMeta.polaroid.classList = 'borderbox';
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
  }</small>`;
  return postMeta;
}

/**
 *
 * @param {Array<Post>} posts
 * @returns {boolean} rerender flag which indicates whether something has changed.
 */
function calculateDiff(posts) {
  let somethingChanged = false;

  // Calculate the posts which need to be added and add them
  posts.forEach((post) => {
    const alreadyRendered = currentPosts.some(
      (currentPost) => currentPost.post.post_id === post.post_id
    );
    if (!alreadyRendered) {
      currentPosts.push(enrichPost(post));
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

async function fetchNewPicturesAndRerender() {
  /**
   * Fetching new pictures from the backend
   */
  const res = await fetch(apiUrl + '/pics');

  const json = await res.json();

  var picsToRender = json.filter((element) => {
    const isIncluded = currentlyRendered.some((other) => {
      //return other.url === element.url;
      return other.post_id === element.post_id;
    });

    return !isIncluded;
  });
  currentlyRendered = json;

  picsToRender = picsToRender.sort((a, b) => {
    return parseInt(a.datetime) >= parseInt(b.datetime);
  });

  /**
   * Slice Array to render only the last 10 pics
   */
  if (picsToRender.length > 30) {
    picsToRender = picsToRender.slice(picsToRender.length - 10);
  }
}

renderDecoration();
setInterval(() => {
  renderApplication();
}, 10000);
