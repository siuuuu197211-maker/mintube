const searchInput = document.getElementById('search');
const suggestionsDiv = document.getElementById('suggestions');
const resultsDiv = document.getElementById('results');
const trendingDiv = document.getElementById('trending');
const relatedDiv = document.getElementById('related');
const searchTitle = document.getElementById('searchTitle');
const relatedTitle = document.getElementById('relatedTitle');

// 추천어 부분 임시 주석 (CORS 문제 때문에)
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

  const items = await fetchSearch(query);
  resultsDiv.innerHTML = '';
  items.forEach(item => createVideoCard(item, resultsDiv));
  if (items.length === 0) resultsDiv.innerHTML = '<p style="text-align:center;">결과가 없습니다</p>';
}

async function loadRelated(videoId) {
  const items = await fetchRelated(videoId);
  relatedDiv.innerHTML = '';
  items.forEach(item => createVideoCard(item, relatedDiv));
  relatedTitle.style.display = items.length > 0 ? 'block' : 'none';
}