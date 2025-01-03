import React, { useState } from 'react';
import './Resources.css';

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
      {userRole === 'admin' && (
        <button className="resource-button" onClick={onDelete}>
          Delete
        </button>
      )}
    </div>
  );
};

// Resources List Component
const Resources = ({ resources, userRole }) => {
  const [resourceList, setResourceList] = useState(resources);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newResource, setNewResource] = useState({ text: '', link: '', pdf: '' });

  const handleAddResource = () => {
    if (!newResource.text || (!newResource.link && !newResource.pdf)) {
      alert('Please provide a name and either a link or a PDF file.');
      return;
    }
    setResourceList([...resourceList, newResource]);
    setIsPopupOpen(false);
    setNewResource({ text: '', link: '', pdf: '' });
  };

  const handleDeleteResource = (index) => {
    const updatedResources = resourceList.filter((_, i) => i !== index);
    setResourceList(updatedResources);
  };

  return (
    <>
      <div className="resources-container">
        {resourceList.map((resource, index) => (
          <Resource
            key={index}
            text={resource.text}
            link={resource.link}
            pdf={resource.pdf}
            userRole={userRole}
            onDelete={() => handleDeleteResource(index)}
          />
        ))}
      </div>
      {userRole === 'admin' && (
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
                        pdf: URL.createObjectURL(e.target.files[0]),
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
