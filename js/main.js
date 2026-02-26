// js/main.js - 검색 15개 시작 + 스크롤당 10개 추가

const searchInput = document.getElementById('search');
const videoGrid = document.getElementById('videoGrid');
const loadingEl = document.getElementById('loading');
const currentTitleEl = document.getElementById('currentTitle');

let currentCategory = 'home';
let currentQuery = '';
let nextPageToken = '';
let isLoading = false;

const categoryIds = {
  music: '10',
  gaming: '20',
  sports: '17',
  news: '25',
  entertainment: '24'
};

// sentinel 안전 생성
let sentinel = document.getElementById('sentinel');
if (!sentinel) {
  sentinel = document.createElement('div');
  sentinel.id = 'sentinel';
  sentinel.style.height = '60px';
  videoGrid.appendChild(sentinel);
}

const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && nextPageToken && !isLoading) {
    loadMore();
  }
}, { threshold: 0.1 });

observer.observe(sentinel);

// 사이드바 클릭
document.querySelectorAll('.sidebar li').forEach(li => {
  li.addEventListener('click', () => {
    document.querySelector('.sidebar .active')?.classList.remove('active');
    li.classList.add('active');
    loadSection(li.dataset.type);
  });
});

// 검색
searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    currentQuery = searchInput.value.trim();
    if (currentQuery) {
      currentTitleEl.textContent = `"${currentQuery}" 검색 결과`;
      // sentinel만 남기고 나머지 삭제
      Array.from(videoGrid.children).forEach(child => {
        if (child !== sentinel) videoGrid.removeChild(child);
      });
      nextPageToken = '';
      loadMore(15); // 처음 검색은 15개
    }
  }
});

// 섹션 로드
async function loadSection(type) {
  currentCategory = type;
  currentQuery = '';
  Array.from(videoGrid.children).forEach(child => {
    if (child !== sentinel) videoGrid.removeChild(child);
  });
  nextPageToken = '';
  currentTitleEl.textContent = type === 'home' ? '홈' : 
    (Object.keys(categoryIds).find(k => categoryIds[k] === categoryIds[type])?.toUpperCase() || type) + ' 인기 급상승';
  await loadMore(20); // 홈/카테고리는 처음 20개
}

// 더 로드 (매개변수로 처음 개수 지정 가능)
async function loadMore(initialCount = 10) {
  if (isLoading) return;
  isLoading = true;
  loadingEl.style.display = 'block';

  let url;
  const maxResults = nextPageToken ? 10 : initialCount; // 처음은 initialCount, 이후는 10개씩

  if (currentQuery) {
    url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(currentQuery)}&regionCode=KR&pageToken=${nextPageToken}&key=${API_KEY}`;
  } else {
    url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&maxResults=${maxResults}&regionCode=KR&pageToken=${nextPageToken}&key=${API_KEY}`;
    if (currentCategory !== 'home' && categoryIds[currentCategory]) {
      url += `&videoCategoryId=${categoryIds[currentCategory]}`;
    }
  }

  console.log('[loadMore] URL:', url);

  const { items, nextPageToken: token } = await fetchVideos(url);
  nextPageToken = token;

  console.log('[loadMore] 이번에 로드된 영상:', items.length);

  items.forEach(v => {
    const card = createCard(v);
    videoGrid.insertBefore(card, sentinel);
  });

  loadingEl.style.display = 'none';
  isLoading = false;

  sentinel.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

// 초기 로드
window.addEventListener('load', () => {
  loadSection('home');
});

document.getElementById('backBtn').onclick = closeModal;
