// js/main.js - 검색 결과 안전 처리 강화 버전

const searchInput = document.getElementById('search');
const suggestionsDiv = document.getElementById('suggestions');
const resultsDiv = document.getElementById('results');
const trendingDiv = document.getElementById('trending');
const relatedDiv = document.getElementById('related');
const searchTitle = document.getElementById('searchTitle');
const relatedTitle = document.getElementById('relatedTitle');

let nextPageToken = '';
let isLoading = false;

// 추천어 임시 주석
// searchInput.addEventListener('input', async () => { ... });

searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') searchVideos();
});

window.addEventListener('load', async () => {
  const items = await fetchTrending();
  trendingDiv.innerHTML = '';
  items.forEach(item => createVideoCard(item, trendingDiv));
});

async function searchVideos() {
  const query = searchInput.value.trim();
  if (!query) return alert('검색어를 입력하세요');

  searchTitle.style.display = 'block';
  resultsDiv.innerHTML = '<p style="text-align:center;">검색 중...</p>';
  relatedDiv.innerHTML = '';
  relatedTitle.style.display = 'none';

  const response = await fetchSearch(query);
  
  let items = [];

  // response가 배열이면 그대로 사용
  if (Array.isArray(response)) {
    items = response;
  }
  // response가 객체이고 items가 배열이면
  else if (response && Array.isArray(response.items)) {
    items = response.items;
  }
  // response가 객체이고 nextPageToken 등이 있으면
  else if (response && response.items) {
    items = response.items || [];
  }

  console.log('[searchVideos] 실제 items:', items);

  resultsDiv.innerHTML = '';
  if (items.length > 0) {
    items.forEach(item => createVideoCard(item, resultsDiv));
  } else {
    resultsDiv.innerHTML = '<p style="text-align:center;">검색 결과가 없습니다</p>';
  }
}

async function loadRelated(videoId) {
  const items = await fetchRelated(videoId);
  relatedDiv.innerHTML = '';
  items.forEach(item => createVideoCard(item, relatedDiv));
  relatedTitle.style.display = items.length > 0 ? 'block' : 'none';
}
