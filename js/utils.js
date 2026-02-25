function createCard(video) {
  const vid = video.id?.videoId || video.id;
  const snip = video.snippet;

  let thumbUrl = snip?.thumbnails?.high?.url ||
                 snip?.thumbnails?.medium?.url ||
                 `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;

  const card = document.createElement('div');
  card.className = 'video-card';
  card.innerHTML = `
    <div class="thumbnail-container">
      <img class="thumbnail" 
           src="${thumbUrl}" 
           alt="${snip?.title || '영상'}" 
           loading="lazy"
           onerror="this.src='https://i.ytimg.com/vi/${vid}/hqdefault.jpg';">
      <span class="duration">${formatDuration(video.contentDetails?.duration)}</span>
    </div>
    <div class="info">
      <div class="title">${snip?.title || '제목 없음'}</div>
      <div class="channel">${snip?.channelTitle || '채널 없음'}</div>
      <div class="meta">조회수 ${Math.floor(Math.random()*500)}만회 • ${Math.floor(Math.random()*30)}일 전</div>
    </div>
  `;

  card.onclick = () => openVideo(vid, snip);
  return card;
}

async function openVideo(videoId, snippet) {
  document.getElementById('videoTitle').textContent = snippet.title || '제목 없음';
  document.getElementById('channelName').textContent = snippet.channelTitle || '채널 없음';

  document.getElementById('player').src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  document.getElementById('modal').style.display = 'flex';
}

function closeModal(e) {
  if (e.target.id !== 'modal') return;
  document.getElementById('player').src = '';
  document.getElementById('modal').style.display = 'none';
}
