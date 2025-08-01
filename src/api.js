// api.js
const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

export async function apiRequest(endpoint, { method = "GET", body, token, params } = {}) {
  let url = BASE_URL + endpoint;
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["token"] = token;
  }
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw data;
  return data;
} 