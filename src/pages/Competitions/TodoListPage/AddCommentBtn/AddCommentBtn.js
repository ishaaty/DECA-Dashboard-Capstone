import React, { useState, useEffect } from 'react';
import './AddCommentBtn.css';
const { useAuth0 } = require('@auth0/auth0-react');

const AddCommentBtn = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newComment, setNewComment] = useState({ comment: '' });

  const { getAccessTokenSilently } = useAuth0();

  // Pre-populate the comment field if there's an existing comment
  useEffect(() => {
    if (props.currentComment) {
      setNewComment({ comment: props.currentComment });
    }
  }, [props.currentComment]); // This ensures the comment is updated if currentComment changes

  const handleComment = async (event_id, user_id) => {
    if (!newComment.comment) {
      alert('Please provide a comment.');
      return;
    }

    try {
      // Send the comment to the backend via POST request
      let response;
      try {
        // Try fetching from the production API first
        const token = await getAccessTokenSilently({ audience: process.env.REACT_APP_AUTH0_AUDIENCE });
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todolist/save-comment/${event_id}/${user_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',  // <== Add this
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: newComment.comment }),
        });
        
        // If the production API fails, fall back to localhost
        if (!response.ok) {
          console.warn('Production API failed, falling back to localhost...');
          const token = await getAccessTokenSilently({ audience: process.env.REACT_APP_AUTH0_AUDIENCE });

          const response = await fetch(`http://localhost:8081/todolist/save-comment/${event_id}/${user_id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ comment: newComment.comment }),
          });

        }
      } catch (err) {
        console.error("Error saving comment:", err);
      }

      const result = await response.json();

      if (response.ok) {
        console.log('Comment saved:', result);

        // Update the parent with the new comment (this will trigger re-render in parent)
        if (props.onCommentSave) {
          props.onCommentSave(result.comment); // Trigger UI update in parent
        }
      } else {
        alert('Failed to save comment');
      }

      // Close the popup and reset the form
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error saving comment:', error);
      alert('Error saving comment');
    }
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
                value={newComment.comment}  // Ensure this is bound to newComment.comment
                onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}  // Update comment state
              />
            </label>

            <div className="popup-buttons">
              <button onClick={() => handleComment(props.event_id, props.user_id)}>Save Comment</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCommentBtn;
