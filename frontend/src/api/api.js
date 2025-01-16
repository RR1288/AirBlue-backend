const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/users';

export const getUsers = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch users');
  return await response.json();
};

export const createUser = async (user) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Failed to create user');
  return await response.json();
};
