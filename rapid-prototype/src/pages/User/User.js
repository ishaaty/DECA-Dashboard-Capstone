import './User.css';
import Header from '../../components/Header/Header'

import React from 'react';
import api from '../../services/axiosConfig';

const createUser = async () => {
  try {
    const response = await api.post('http://localhost:8081/user/create', {
      first_name: 'user',
      last_name: 'lastname',
      email: 'user@email.com',
    });
    console.log('User created:', response.data);
  } catch (error) {
    console.error('Error creating user:', error.response?.data || error.message);
  }
};
  
export default function User() {
    return (
        <>
            <Header />
            <h2>User</h2>
            <div>
                <h1>Create User</h1>
                <button onClick={createUser}>Create User</button>
            </div>
        </>
    )
}