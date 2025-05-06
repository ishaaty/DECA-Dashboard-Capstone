import React, { useState, useEffect } from 'react';
import './ResourceCard.css';
import {useAuth0} from '@auth0/auth0-react';

import axios from '../../../services/axiosConfig';

// Single Resource Component
const Resource = ({ text, link, pdf, onDelete, userRole }) => {

  return (
    <div className="resource-box">
      <p className="resource-text">{text}</p>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="resource-button">
          Open Link
        </a>
      )}
      {pdf && (
        <a href={pdf} target="_blank" rel="noopener noreferrer" className="resource-button">
          Open PDF
        </a>
      )}
      {(userRole === 'admin' || userRole === 'board member') && (
        <button className="resource-button" onClick={onDelete}>
          Delete
        </button>
      )}
    </div>
  );
};

// Resources List Component
const Resources = ({ resources, userRole }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [resourceList, setResourceList] = useState([]);

  // Synchronize resourceList state with resources prop
  useEffect(() => {
    setResourceList(resources);
  }, [resources]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newResource, setNewResource] = useState({ text: '', link: '', pdf: '' });


  const handleAddResource = async () => {
    if (!newResource.text || (!newResource.link && !newResource.pdf)) {
        alert('Please provide a name and either a link or a PDF file.');
        return;
    }

    if (newResource.link && newResource.pdf) {
        alert('Please provide either a link or a PDF file, not both.');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('resource_name', newResource.text);
        if (newResource.link) {
            formData.append('web_url', newResource.link);
        }
        if (newResource.pdf) {
            formData.append('pdf', newResource.pdf);
        }

      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });

      let response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/resources/add`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' }, Authorization: `Bearer ${token}` }
      );

        setResourceList([...resourceList, response.data]);
        setIsPopupOpen(false);
        setNewResource({ text: '', link: '', pdf: null });
    } catch (error) {
        console.error('Error adding resource:', error);
        alert('Failed to add resource.');
    }
  };

  

  const handleDeleteResource = async (id) => {
    try {
      // send the id of the resource to delete to the backend
      let token = await getAccessTokenSilently({  
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });

      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/resources/delete/${id}`);

      setResourceList(resourceList.filter((resource) => resource.resource_id !== id)); // Update local state
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource.');
    }
  };
  

  return (
    <>
      <div className="resources-container">
        {resourceList.map((resource, index) => (
          <Resource
            key={resource.resource_id}
            text={resource.resource_name || resource.text}
            link={resource.web_url || resource.link}
            pdf={resource.file_url || resource.pdf}
            userRole={userRole}
            onDelete={() => handleDeleteResource(resource.resource_id)}
          />
        ))}
      </div>
      {(userRole === 'admin' || userRole === "board member") && (
        <>
          <div className="center-button-container">
            <button className="center-button" onClick={() => setIsPopupOpen(true)}>
              Add New Resource
            </button>
          </div>
          {isPopupOpen && (
            <div className="popup">
              <div className="popup-content">
                <h2>Add New Resource</h2>
                <label>
                  Name:
                  <input
                    type="text"
                    value={newResource.text}
                    onChange={(e) => setNewResource({ ...newResource, text: e.target.value })}
                  />
                </label>
                <label>
                  Link:
                  <input
                    type="url"
                    value={newResource.link}
                    onChange={(e) =>
                      setNewResource({ ...newResource, link: e.target.value, pdf: '' })
                    }
                  />
                </label>
                <label>
                  PDF:
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setNewResource({
                        ...newResource,
                        pdf: e.target.files[0], // Store actual file, not a blob URL
                        link: '',
                      })
                    }
                  />
                </label>
                <div className="popup-buttons">
                  <button onClick={handleAddResource}>Add Resource</button>
                  <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Resources;
