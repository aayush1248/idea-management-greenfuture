
// import React, { useState, useEffect } from 'react';
// import '../css/IdeasConfirm.css';
// import axios from 'axios';
// import AlertDialog from '../ui/constant/alertDialog';

// const IdeasConfirm = () => {
//   const [ideas, setIdeas] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [alertMessage, setAlertMessage] = useState(null);
//   const [selectedIdea, setSelectedIdea] = useState(null);
//   const [notification, setNotification] = useState('');
//   const [globalAlert, setGlobalAlert] = useState(false); // State for top alert dialog

//   // Fetch ideas from the API
//   const fetchIdeas = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/confirmidea');
//       if (!response.ok) {
//         throw new Error('Failed to fetch ideas');
//       }
//       const data = await response.json();
//       setIdeas(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchIdeas();
//   }, []);

//   useEffect(() => {
//     const hasVoted = localStorage.getItem('voted') === 'true';
//     setGlobalAlert(hasVoted); // Show global alert if voted
//   }, []);

//   // Handle vote confirmation
//   const handleVote = async (e, idea) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const response = await axios.patch(`http://localhost:3001/confirmidea/${idea._id}`, {
//         voteIncrement: 1, // Increment the vote count by 1
//       });
//       if (response.status === 200) {
//         setSelectedIdea(idea);
//         localStorage.setItem('voted', true);
//         setGlobalAlert(true); // Show global alert
//         setNotification(`You voted on the idea: "${idea.idea}"`);
//         fetchIdeas();
//       } else {
//         throw new Error('Failed to update vote');
//       }
//     } catch (error) {
//       console.error('Error updating vote:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const clearGlobalAlert = () => {
//     setGlobalAlert(false);
//   };

//   const clearNotification = () => {
//     setNotification('');
//   };

//   if (loading) return <div>Loading ideas...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="ideas-container">
//       {/* Global Alert Dialog */}
//       {globalAlert && (
//         <div className="global-alert">
//           <p>Your vote has been successfully recorded!</p>
//         </div>
//       )}
//       <h2>Submitted Ideas</h2>
//       {ideas.length === 0 ? (
//         <p>No ideas found</p>
//       ) : (
//         <div className="ideas-list">
//           {ideas.map((idea) => (
//             <div key={idea._id} className="idea-card">
//               <div className="idea-content">
//                 <p><strong>Idea:</strong> {idea.idea}</p>
//                 <p><strong>Submitted By:</strong> {idea.email}</p>
//                 <p><small>Submitted At: {new Date(idea.createdAt).toLocaleString()}</small></p>
//               </div>
//               {globalAlert === false && (
//        <div className="idea-buttons">
//        <button
//          className="vote-btn"
//          onClick={(e) => handleVote(e, idea)}
//          disabled={isSubmitting}
//        >
//          Vote
//        </button>
//      </div>
//       )}
//             </div>
//           ))}
//         </div>
//       )}
//       {notification && (
//         <div className="notification" onClick={clearNotification}>
//           {notification}
//         </div>
//       )}
//     </div>
//   );
// };

// export default IdeasConfirm;

import React, { useState, useEffect } from 'react';
import '../css/IdeasConfirm.css';
import axios from 'axios';
import AlertDialog from '../ui/constant/alertDialog';

const IdeasConfirm = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [notification, setNotification] = useState('');
  const [globalAlert, setGlobalAlert] = useState(false); // State for top alert dialog
  const userRole = localStorage.getItem('userrole'); // Get user role from localStorage

  // Fetch ideas from the API
  const fetchIdeas = async () => {
    try {
      const response = await fetch('http://localhost:3001/confirmidea');
      if (!response.ok) {
        throw new Error('Failed to fetch ideas');
      }
      const data = await response.json();
      setIdeas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  useEffect(() => {
    const hasVoted = localStorage.getItem('voted') === 'true';
    setGlobalAlert(hasVoted); // Show global alert if voted
  }, []);

  // Handle vote confirmation
  const handleVote = async (e, idea) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.patch(`http://localhost:3001/confirmidea/${idea._id}`, {
        voteIncrement: 1, // Increment the vote count by 1
      });
      if (response.status === 200) {
        setSelectedIdea(idea);
        localStorage.setItem('voted', true);
        setGlobalAlert(true); // Show global alert
        setNotification(`You voted on the idea: "${idea.idea}"`);
        fetchIdeas();
      } else {
        throw new Error('Failed to update vote');
      }
    } catch (error) {
      console.error('Error updating vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handlePostNotification = async (e, email) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3001/notifications', {
        email: email,
        message: 'rewarded',
      });
      alert('User is rewarded')
      console.log('Notification posted successfully:', response.data);
    } catch (error) {
      console.error('Error posting notification:', error);
    }
  };
  

  const handleManagerAction = async (idea) => {
    try {
      // Example action for regional manager
      const response = await axios.patch(`http://localhost:3001/manageraction/${idea._id}`, {
        actionTaken: true,
      });
      if (response.status === 200) {
        setNotification(`Action taken for idea: "${idea.idea}"`);
        fetchIdeas();
      } else {
        throw new Error('Failed to perform action');
      }
    } catch (error) {
      console.error('Error performing manager action:', error);
    }
  };

  const clearGlobalAlert = () => {
    setGlobalAlert(false);
  };

  const clearNotification = () => {
    setNotification('');
  };

  if (loading) return <div>Loading ideas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="ideas-container">
      {/* Global Alert Dialog */}
      {globalAlert && (
        <div className="global-alert">
          <p>Your vote has been successfully recorded!</p>
        </div>
      )}
      <h2>Submitted Ideas</h2>
      {ideas.length === 0 ? (
        <p>No ideas found</p>
      ) : (
        <div className="ideas-list">
          {ideas.map((idea) => (
            <div key={idea._id} className="idea-card">
              <div className="idea-content">
                <p><strong>Idea:</strong> {idea.idea}</p>
                <p><strong>{idea.vote}</strong> {idea.email}</p>
                <p><small>Submitted At: {new Date(idea.createdAt).toLocaleString()}</small></p>
              </div>
              {globalAlert === false && (
                <div className="idea-buttons">
                  <button
                    className="vote-btn"
                    onClick={(e) => handleVote(e, idea)}
                    disabled={isSubmitting}
                  >
                    Vote
                  </button>
                </div>
              )}
              {userRole === 'Regional Manager' && (
                <div className="idea-buttons">
                  <button
                    className="manager-action-btn"
                    onClick={(e) => handlePostNotification(e,idea.email)}
                  >
                    Manager Action
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {notification && (
        <div className="notification" onClick={clearNotification}>
          {notification}
        </div>
      )}
    </div>
  );
};

export default IdeasConfirm;
