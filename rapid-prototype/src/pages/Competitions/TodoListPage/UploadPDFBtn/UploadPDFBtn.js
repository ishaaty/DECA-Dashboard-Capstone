import React, { useState } from 'react';
import './UploadPDFBtn.css';

const UploadPDFBtn = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newPDF, setNewPDF] = useState({ requirement: '', pdf: '' });

  const handlePDF = () => {
    if (!newPDF.requirement && !newPDF.pdf) {
      alert('Please provide a requirement and pdf.');
      return;
    }
    console.log('New PDF:', newPDF);
    setIsPopupOpen(false);
    setNewPDF({ requirement: '', pdf: '' });
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
              <input
                type="text"
                value={props.requirement}
                onChange={(e) => setNewPDF({ ...newPDF, requirement: e.target.value })}
              />
            </label>
            <label>
              PDF:
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setNewPDF({
                    ...newPDF,
                    pdf: URL.createObjectURL(e.target.files[0])
                  })
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
