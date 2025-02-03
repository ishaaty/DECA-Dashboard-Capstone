import React, { useState } from 'react';
import './AddCommentBtn.css';

const AddCommentBtn = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newComment, setNewComment] = useState({ comment: '' });

  const handleComment = () => {
    if (!newComment.comment) {
      alert('Please provide a comment.');
      return;
    }
    console.log('New Comment:', newComment);
    setIsPopupOpen(false);
    setNewComment({ comment: '' });
  };

  return (
    <div className="create-event-container">
      <div>
        <button className="add-comment-btn" onClick={() => setIsPopupOpen(true)}>
          Add Comment
        </button>
      </div>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add Comment</h2>
            <label>
              Comment:
              <input
                type="text"
                value={newComment.comment}
                onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
              />
            </label>

            <div className="popup-buttons">
              <button onClick={handleComment}>Save Comment</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCommentBtn;
