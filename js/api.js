const API_KEY = 'AIzaSyBao4SOH05ITkhUIDBefDxwhPmt7gCS0pw';  // ← 네 키 그대로

async function fetchTrending() {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&regionCode=KR&key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.items || [];
  } catch (e) {
    console.error('Trending 실패:', e);
    return [];
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
    return [];
  }
}

async function fetchRelated(videoId) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=8&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.items || [];
  } catch (e) {
    console.error('Related 실패:', e);
    return [];
  }
}
