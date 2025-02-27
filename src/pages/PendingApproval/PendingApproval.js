import React, { useState } from 'react';
import axios from 'axios';

function PendingApproval() {
  const [userClass, setUserClass] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/user/create', {
        user_class: userClass,
        email: schoolEmail,
      });
      setMessage(response.data.message);
    } catch (error) {
      setError('Error creating user. Please try again.');
    }
  };

  return (
    <div>
      <h3>Pending Approval</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User Class:</label>
          <input
            type="text"
            value={userClass}
            onChange={(e) => setUserClass(e.target.value)}
            required
          />
        </div>
        <div>
          <label>School Email:</label>
          <input
            type="email"
            value={schoolEmail}
            onChange={(e) => setSchoolEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default PendingApproval;
