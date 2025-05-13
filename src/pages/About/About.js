// import './About.css';
// import Header from '../../components/Header/Header'

// export default function About() {
//     return (
//         <>
//             <Header />
//             <h2>About</h2>
//             <h3>***Add description of DECA Club***</h3>
//         </>
//     )
// }

import React, { useState, useEffect } from 'react';
import './About.css';
import Header from '../../components/Header/Header';
import axios from 'axios';

export default function About() {
  const [description, setDescription] = useState(''); // State to hold the description
  const [isEditing, setIsEditing] = useState(false); // State to toggle between edit mode and view mode
  const [error, setError] = useState(null); // State for error handling

  // Fetch the current description from the backend when the component mounts

  // Handle the change in the description textbox


  return (
    <>
      <Header />
      <h2>About</h2>
      {error && <p>{error}</p>}
      <div className="about-container">
        {isEditing ? (
          <div>
            <textarea
              value={description}
              rows="10"
              cols="50"
            />
            <br />
          </div>
        ) : (
          <div>
            <p>DECA prepares emerging leaders and entrepreneurs for careers in marketing, finance, hospitality and management in high schools and colleges around the globe. The Bergen County Academies chapter has over 100 student members who successfully compete in the district, state, and international competition levels.</p>
          </div>
        )}
      </div>
    </>
  );
}
