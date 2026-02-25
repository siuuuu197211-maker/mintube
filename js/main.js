// js/main.js - 완전 안정 버전 (sentinel을 절대 잃지 않게 + 강제 추가)

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

// sentinel을 **한 번만 만들고 절대 삭제하지 않음**
let sentinel = document.getElementById('sentinel');
if (!sentinel) {
  sentinel = document.createElement('div');
  sentinel.id = 'sentinel';
  sentinel.style.height = '60px';
  sentinel.style.minHeight = '60px';
  sentinel.style.background = 'transparent';
  videoGrid.appendChild(sentinel);
  console.log('[INIT] sentinel 새로 생성됨');
} else {
  console.log('[INIT] 기존 sentinel 재사용');
}

const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && nextPageToken && !isLoading) {
    console.log('[Observer] 스크롤 끝 → 추가 로드');
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

// 검색 엔터
searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    currentQuery = searchInput.value.trim();
    if (currentQuery) {
      currentTitleEl.textContent = `"${currentQuery}" 검색 결과`;
      clearGridExceptSentinel();
      nextPageToken = '';
      loadMore();
    }
  }
});

// sentinel만 남기고 나머지 삭제 함수 (안전 버전)
function clearGridExceptSentinel() {
  console.log('[clearGrid] sentinel 제외하고 삭제 시작');
  const children = Array.from(videoGrid.children);
  children.forEach(child => {
    if (child !== sentinel) {
      videoGrid.removeChild(child);
    }
  });
  console.log('[clearGrid] 삭제 완료 - sentinel 유지됨');
}

// 섹션 로드
async function loadSection(type) {
  currentCategory = type;
  currentQuery = '';
  clearGridExceptSentinel();
  nextPageToken = '';
  currentTitleEl.textContent = type === 'home' ? '홈' : 
    (Object.keys(categoryIds).find(k => categoryIds[k] === categoryIds[type])?.toUpperCase() || type) + ' 인기 급상승';
  console.log('[loadSection] 섹션 변경:', type);
  await loadMore();
}

// 더 로드 (카드 추가 시 sentinel 앞에만)
async function loadMore() {
  if (isLoading) return;
  isLoading = true;
  loadingEl.style.display = 'block';

  let url;
  if (currentQuery) {
    url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(currentQuery)}&regionCode=KR&pageToken=${nextPageToken}&key=${API_KEY}`;
  } else {
    url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&maxResults=20&regionCode=KR&pageToken=${nextPageToken}&key=${API_KEY}`;
    if (currentCategory !== 'home' && categoryIds[currentCategory]) {
      url += `&videoCategoryId=${categoryIds[currentCategory]}`;
    }
  }

  console.log('[loadMore] URL:', url);

  const { items, nextPageToken: token } = await fetchVideos(url);
  nextPageToken = token;

  console.log('[loadMore] 영상 수:', items.length);

  if (items.length === 0) {
    const msg = document.createElement('p');
    msg.style.textAlign = 'center';
    msg.style.padding = '60px 0';
    msg.style.color = '#888';
    msg.textContent = currentQuery ? '검색 결과가 없습니다' : '인기 영상을 불러오지 못했습니다';
    videoGrid.insertBefore(msg, sentinel);
  } else {
    items.forEach(v => {
      const card = createCard(v);
      videoGrid.insertBefore(card, sentinel);
      console.log('[loadMore] 카드 추가:', v.snippet?.title || '제목 없음');
    });
  }

  loadingEl.style.display = 'none';
  isLoading = false;

  // 강제 리프레시
  sentinel.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

// 초기 로드
window.addEventListener('load', () => {
  console.log('[INIT] 홈 로드 시작');
  loadSection('home');
});

document.getElementById('backBtn').onclick = closeModal;
