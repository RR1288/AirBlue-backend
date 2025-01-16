import { useState, useEffect } from 'react';
import { getUsers } from '../api/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
