import './About.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import { useContext, useEffect, useState } from 'react';
import { UserRoleContext } from '../../context/UserRoleContext';
import axios from 'axios';

export default function About() {
  const userRole = useContext(UserRoleContext);
  const [description, setDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/about`);
        setDescription(response.data.description || '');
      } catch (error) {
        console.error('Error fetching About description:', error);
      }
    };

    fetchAbout();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/about`, {
        description,
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error saving About description:', error);
    }
  };

  return (
    <div className="about-page">
      <Header />
      <Menu />
      <h2>About</h2>
      {true ? (
        <>
          {editMode ? (
            <>
              <textarea
                className="about-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button onClick={handleSave} className="save-button">Save</button>
            </>
          ) : (
            <>
              <p className="about-text">{description || 'No description set.'}</p>
              <button onClick={() => setEditMode(true)} className="edit-button">Edit</button>
            </>
          )}
        </>
      ) : (
        <p className="about-text">{description || 'No description set.'}</p>
      )}
    </div>
  );
}
