import React, { useState } from 'react';
import './UploadPDFBtn.css';
import axios from 'axios';

const UploadPDFBtn = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newPDF, setNewPDF] = useState({ requirement: '', pdf: null });

  const handlePDF = async () => {
    console.log("Current newPDF state:", newPDF); // Debugging

    if (!newPDF.requirement || !newPDF.pdf) {
      alert('Please provide a requirement and a PDF.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', newPDF.pdf);
    formData.append('requirement', newPDF.requirement); // Ensure requirement is sent

    try {
      const response = await axios.post(
        `http://localhost:8081/todolist/upload-pdf/${props.eventId}/${props.userId}`, 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      console.log('Upload successful:', response.data);
      alert('PDF uploaded successfully!');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload PDF');
    }

    setIsPopupOpen(false);
    setNewPDF({ requirement: '', pdf: null });
};


  return (
    <div className="create-event-container">
      <div>
        <button className="upload-pdf-btn" onClick={() => setIsPopupOpen(true)}>
          Upload Todo List Item
        </button>
      </div>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Upload Item</h2>
            <label>
              Requirement:
              <select
                value={newPDF.requirement}
                onChange={(e) => setNewPDF({ ...newPDF, requirement: e.target.value })}
              >
                <option value="" disabled>Select a requirement</option>
                {props.requirements.map((req, index) => (
                  <option key={index} value={index + 1}>{req}</option>  // Use index + 1 for numeric values
                ))}
              </select>
            </label>
            <label>
              PDF:
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setNewPDF({ ...newPDF, pdf: e.target.files[0] })
                }
              />
            </label>

            <div className="popup-buttons">
              <button onClick={handlePDF}>Submit Item</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPDFBtn;
