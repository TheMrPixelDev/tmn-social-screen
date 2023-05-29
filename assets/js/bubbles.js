const container = document.getElementById('decorations-container');

for (var i = 0; i < 20; i++) {
  const bubbleContainer = document.createElement('div');
  const bubble = document.createElement('span');
  bubble.classList = 'dot';
  bubbleContainer.classList.add('outer-bubble');
  const x = Math.round(Math.random() * 10) * 10;
  const y = Math.round(Math.random() * 10) * 10;
  const animationLength = Math.round(Math.random() * 10) + 3;
  //const radius = Math.round(Math.random() * 3);
  bubbleContainer.style.position = 'absolute';
  bubbleContainer.style.top = y + '%';
  bubbleContainer.style.left = x + '%';
  bubbleContainer.style.zIndex = 99;
  bubbleContainer.style.animation = `bubbleAnimation ${animationLength}s linear infinite`;
  //bubble.style.width = radius + 'rem';
  //bubble.style.height = radius + 'rem';
  //bubble.classList.add('bubble');
  bubbleContainer.appendChild(bubble);
  container.appendChild(bubbleContainer);
}
