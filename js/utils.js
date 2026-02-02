function createVideoCard(item, container) {
  const videoId = item.id?.videoId || item.id;
  // 썸네일 우선순위: high → medium → 기본 hqdefault
  const thumb = item.snippet?.thumbnails?.high?.url ||
                item.snippet?.thumbnails?.medium?.url ||
                `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const card = document.createElement('div');
  card.className = 'video-card';
  card.innerHTML = `
    <img class="thumbnail" src="${thumb}" alt="${item.snippet?.title || '제목 없음'}" loading="lazy" onerror="this.src='https://i.ytimg.com/vi/${videoId}/hqdefault.jpg';">
    <div class="details">
      <h3>${item.snippet?.title || '제목 없음'}</h3>
      <p class="channel">${item.snippet?.channelTitle || '채널 없음'}</p>
    </div>
  `;
  card.addEventListener('click', () => {
    playVideo(videoId);
    loadRelated(videoId);
  });
  container.appendChild(card);
}

function playVideo(videoId) {
  document.getElementById('player').src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  document.getElementById('modal').style.display = 'flex';
}

function closeModal(e) {
  if (e.target.id === 'modal' || e.target.tagName !== 'IFRAME') {
    document.getElementById('player').src = '';
    document.getElementById('modal').style.display = 'none';
  }
}