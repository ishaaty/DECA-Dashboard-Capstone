import React, { useState } from 'react';
import './PendingApproval.css';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

function PendingApproval() {
  const { user } = useAuth0(); // Get authenticated user details
  const accountEmail = user?.email || ''; // Extract account email from Auth0

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userClass, setUserClass] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [homePhone, setHomePhone] = useState('');
  const [gender, setGender] = useState('');
  const [demographic, setDemographic] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8081/user/create-update', {
        first_name: firstName,
        last_name: lastName,
        user_class: userClass,
        account_email: accountEmail, // Retrieved from Auth0
        email: schoolEmail,
        cell_phone: cellPhone || null,
        home_phone: homePhone || null,
        gender: gender || null,
        demographic: demographic || null,
        dob: dob || null,
      });

      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || 'Error processing request.');
    }
  };

  return (
    <div>
      <h1 id="pendingheader">Pending Approval</h1>
      <h3 id="pendingdesc">Thank you for your interest in BCA DECA! Please fill out this form so your account can be approved.</h3>
      <form onSubmit={handleSubmit}>
        <div id ="pendingentries">
        <div>
          <label class="pendinglabel">First Name: *</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div>
          <label class="pendinglabel">Cell Phone: </label>
          <input type="tel" value={cellPhone} onChange={(e) => setCellPhone(e.target.value)} />
        </div>
        <div>
          <label class="pendinglabel">Last Name: *</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div>
          <label class="pendinglabel">Home Phone:</label>
          <input type="tel" value={homePhone} onChange={(e) => setHomePhone(e.target.value)} />
        </div>
        <div>
          <label class="pendinglabel">Class Year: *</label>
          <input type="text" value={userClass} onChange={(e) => setUserClass(e.target.value)} required />
        </div>
        <div>
          <label class="pendinglabel">Gender:</label>
          <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
        </div>
        <div>
          <label class="pendinglabel">School Email: *</label>
          <input type="email" value={schoolEmail} onChange={(e) => setSchoolEmail(e.target.value)} required />
        </div>
        <div>
          <label class="pendinglabel">Demographic:</label>
          <input type="text" value={demographic} onChange={(e) => setDemographic(e.target.value)} />
        </div>
        <div>
          <label class="pendinglabel">Date of Birth:</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        </div>
        <button id="pendingbtn" type="submit">Submit</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default PendingApproval;
