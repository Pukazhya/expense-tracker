const API_BASE_URL = 'http://127.0.0.1:5000/api';

function getToken() { return localStorage.getItem('expensioToken'); }
function setSession(session) {
  localStorage.setItem('expensioToken', session.token);
  localStorage.setItem('expensioUser', JSON.stringify(session.user));
}
function clearSession() { localStorage.removeItem('expensioToken'); localStorage.removeItem('expensioUser'); }
function requireAuth() {
  if (!getToken()) { window.location.replace('login.html'); return false; }
  return true;
}
async function apiRequest(path, options = {}) {
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (response.status === 401) { clearSession(); window.location.replace('login.html'); throw new Error('Your session has expired. Please log in again.'); }
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}
