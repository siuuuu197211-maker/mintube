const searchInput = document.getElementById('search');
const suggestionsDiv = document.getElementById('suggestions');
const resultsDiv = document.getElementById('results');
const trendingDiv = document.getElementById('trending');
const relatedDiv = document.getElementById('related');
const searchTitle = document.getElementById('searchTitle');
const relatedTitle = document.getElementById('relatedTitle');

let nextPageToken = '';
let isLoading = false;

// 추천어는 CORS 문제로 주석 처리
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
  nextPageToken = '';
  isLoading = false;

  const response = await fetchSearch(query);
  const items = response.items || [];

  resultsDiv.innerHTML = '';
  items.forEach(item => createVideoCard(item, resultsDiv));
  if (items.length === 0) resultsDiv.innerHTML = '<p style="text-align:center;">결과가 없습니다</p>';

  // sentinel 다시 붙이기
  const sentinel = document.createElement('div');
  sentinel.id = 'sentinel';
  sentinel.style.height = '60px';
  resultsDiv.appendChild(sentinel);
}

async function loadMoreSearchResults() {
  if (isLoading || !nextPageToken) return;
  isLoading = true;

  const query = searchInput.value.trim();
  if (!query) return;

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=10&pageToken=${nextPageToken}&key=${API_KEY}`;
  const response = await fetchSearchMore(url);
  const items = response.items || [];
  nextPageToken = response.nextPageToken;

  items.forEach(item => createVideoCard(item, resultsDiv));
  isLoading = false;
}

// fetchSearch (처음 15개)
async function fetchSearch(query) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=15&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return { items: [], nextPageToken: null };
  const data = await res.json();
  return { items: data.items || [], nextPageToken: data.nextPageToken };
}

// fetchSearchMore (이후 10개)
async function fetchSearchMore(url) {
  const res = await fetch(url);
  if (!res.ok) return { items: [], nextPageToken: null };
  const data = await res.json();
  return { items: data.items || [], nextPageToken: data.nextPageToken };
}

async function fetchTrending() {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&regionCode=KR&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
}

async function fetchRelated(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=8&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
}

async function loadRelated(videoId) {
  const items = await fetchRelated(videoId);
  relatedDiv.innerHTML = '';
  items.forEach(item => createVideoCard(item, relatedDiv));
  relatedTitle.style.display = items.length > 0 ? 'block' : 'none';
}
