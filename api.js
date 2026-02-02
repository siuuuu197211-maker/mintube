const API_KEY = 'AIzaSyBao4SOH05ITkhUIDBefDxwhPmt7gCS0pw';  // ← 새로 만든 키로 교체 필수!

async function fetchTrending() {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&regionCode=KR&key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.items || [];
  } catch (e) {
    console.error('Trending 실패:', e);
    // 더미 데이터 fallback (테스트용)
    return [
      { id: 'dQw4w9WgXcQ', snippet: { title: 'Never Gonna Give You Up (테스트)', channelTitle: 'Rick Astley', thumbnails: { high: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' } } } },
      { id: '9bZkp7q19f0', snippet: { title: 'Gangnam Style (테스트)', channelTitle: 'PSY', thumbnails: { high: { url: 'https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg' } } } },
      // 필요하면 10개 더 추가
    ];
  }
}

async function fetchSearch(query) {
  if (!query) return [];
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=15&key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.items || [];
  } catch (e) {
    console.error('Search 실패:', e);
    return []; // 검색 실패 시 빈 배열
  }
}

async function fetchRelated(videoId) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=8&key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.items || [];
  } catch (e) {
    console.error('Related 실패:', e);
    return [];
  }
}

// 추천어는 CORS 때문에 직접 fetch 어려움 → 임시 주석
// async function fetchSuggestions(query) { ... }