const BASE_URL = 'https://forum-api.dicoding.dev/v1';

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function putAccessToken(token) {
  localStorage.setItem('accessToken', token);
}

function removeAccessToken() {
  localStorage.removeItem('accessToken');
}

async function fetchWithAuth(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
}

async function handleResponse(response) {
  const json = await response.json();
  if (json.status !== 'success') {
    throw new Error(json.message);
  }
  return json.data;
}

// ---------- Auth ----------
async function register({ name, email, password }) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const { user } = await handleResponse(response);
  return user;
}

async function login({ email, password }) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const { token } = await handleResponse(response);
  return token;
}

async function getOwnProfile() {
  const response = await fetchWithAuth(`${BASE_URL}/users/me`);
  const { user } = await handleResponse(response);
  return user;
}

async function getAllUsers() {
  const response = await fetch(`${BASE_URL}/users`);
  const { users } = await handleResponse(response);
  return users;
}

// ---------- Threads ----------
async function getAllThreads() {
  const response = await fetch(`${BASE_URL}/threads`);
  const { threads } = await handleResponse(response);
  return threads;
}

async function getThreadDetail(threadId) {
  const response = await fetch(`${BASE_URL}/threads/${threadId}`);
  const { detailThread } = await handleResponse(response);
  return detailThread;
}

async function createThread({ title, body, category }) {
  const response = await fetchWithAuth(`${BASE_URL}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, category }),
  });
  const { thread } = await handleResponse(response);
  return thread;
}

async function createComment({ threadId, content }) {
  const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  const { comment } = await handleResponse(response);
  return comment;
}

// ---------- Votes ----------
async function upVoteThread(threadId) {
  const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/up-vote`, { method: 'POST' });
  return handleResponse(response);
}

async function downVoteThread(threadId) {
  const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/down-vote`, { method: 'POST' });
  return handleResponse(response);
}

async function neutralizeThreadVote(threadId) {
  const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/neutral-vote`, { method: 'POST' });
  return handleResponse(response);
}

async function upVoteComment(threadId, commentId) {
  const response = await fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`,
    { method: 'POST' },
  );
  return handleResponse(response);
}

async function downVoteComment(threadId, commentId) {
  const response = await fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`,
    { method: 'POST' },
  );
  return handleResponse(response);
}

async function neutralizeCommentVote(threadId, commentId) {
  const response = await fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`,
    { method: 'POST' },
  );
  return handleResponse(response);
}

// ---------- Leaderboards ----------
async function getLeaderboards() {
  const response = await fetch(`${BASE_URL}/leaderboards`);
  const { leaderboards } = await handleResponse(response);
  return leaderboards;
}

const api = {
  putAccessToken,
  getAccessToken,
  removeAccessToken,
  register,
  login,
  getOwnProfile,
  getAllUsers,
  getAllThreads,
  getThreadDetail,
  createThread,
  createComment,
  upVoteThread,
  downVoteThread,
  neutralizeThreadVote,
  upVoteComment,
  downVoteComment,
  neutralizeCommentVote,
  getLeaderboards,
};

export default api;
