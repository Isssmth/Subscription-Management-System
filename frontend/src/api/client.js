const BASE_URL = '';

export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        (data?.errors ? Object.values(data.errors).join(', ') : 'An error occurred');
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    throw err;
  }
}

