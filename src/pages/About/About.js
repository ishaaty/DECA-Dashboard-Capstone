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
  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const response = await axios.get('http://localhost:8081/getDescription');
        setDescription(response.data.description); // Assuming the backend sends a description field
      } catch (err) {
        console.error("Error fetching description:", err);
        setError("Failed to load description.");
      }
    };

    fetchDescription();
  }, []);

  // Handle the change in the description textbox
  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  // Handle saving the updated description to the backend
  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:8081/saveDescription', {
        description: description,
      });
      if (response.status === 200) {
        alert('Description saved successfully!');
        setIsEditing(false); // Exit edit mode after saving
      }
    } catch (err) {
      console.error("Error saving description:", err);
      setError("Failed to save description.");
    }
  };

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
              onChange={handleChange}
              rows="10"
              cols="50"
            />
            <br />
            {/* <button onClick={handleSave}>Save</button> */}
            <button onClick={() => setIsEditing(false)}>Save</button>
          </div>
        ) : (
          <div>
            <p>{description}</p>
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </div>
        )}
      </div>
    </>
  );
}
