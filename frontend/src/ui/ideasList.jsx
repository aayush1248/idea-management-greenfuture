import React, { useState, useEffect } from 'react';
import '../css/Ideas.css';
import axios from 'axios';
import AlertDialog from '../ui/constant/alertDialog';
// import { getFirebaseToken } from './firebase';  // Import the function
// import { getMessaging, getToken } from "firebase/messaging";


const Ideas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [userNotification, setUserNotification] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
 

  //     };
  //     fetchToken();
  //   }, []);
  
    // const requestPermission = async (email) => {
    //   try {
    //     const permission = await Notification.requestPermission();
    //     if (permission === 'granted') {
    //       console.log('Notification permission granted.');
    //       fetchToken(email);  // After permission is granted, fetch token
    //     } else {
    //       console.log('Notification permission denied.');
    //     }
    //   } catch (error) {
    //     console.error('Error requesting notification permission:', error);
    //   }
    // };
    
    // Fetch FCM Token
    // const fetchToken = async (email) => {
    //   try {
    //     const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
    //     if (token) {
    //       console.log('FCM Token:', token);
    //       sendTokenToBackend(email, token);
    //     } else {
    //       console.log('No token available. Request permission to receive notifications.');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching FCM token:', error);
    //   }
    // };
    
    // Send FCM Token to the Backend
    // const sendTokenToBackend = async (email, token) => {
    //   try {
    //     const response = await fetch('http://localhost:3001/api/save-token', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ email, token }),
    //     });
    
    //     if (!response.ok) {
    //       console.error('Error: Non-OK HTTP status:', response.status);
    //       return;
    //     }
    
    //     // Attempt to parse the JSON response
    //     let data;
    //     try {
    //       data = await response.json();
    //     } catch (jsonError) {
    //       console.error('Failed to parse JSON response:', jsonError);
    //       console.error('Raw response body:', await response.text());
    //       return;
    //     }
    
    //     if (data.success) {
    //       console.log('FCM token sent to backend successfully');
    //     } else {
    //       console.error('Failed to send token:', data.error);
    //     }
    //   } catch (error) {
    //     console.error('Error sending token to backend:', error);
    //   }
    // };
    


    // const sendNotification = async (email, title, body) => {
    //   if (!email || !title || !body) {
    //     setResponseMessage('Please fill in all fields');
    //     return;
    //   }
  
    //   try {
    //     const response = await fetch('http://localhost:3001/api/send-notification', {  // Change port here
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ email, title, body }),
    //     });
        
  
    //     const data = await response.json();
    //     if (data.success) {
    //       setResponseMessage('Notification sent successfully!');
    //     } else {
    //       setResponseMessage(`Error: ${data.error}`);
    //     }
    //   } catch (error) {
    //     setResponseMessage(`Error: ${error.message}`);
    //   }
    // };

// const requestNotificationPermission = async (email) => {
//   try {
//     const permission = await Notification.requestPermission();

//     if (permission === 'granted') {
//       console.log('Notification permission granted.');

//       const messaging = getMessaging();
//       const token = await getToken(messaging, { vapidKey: 'BHs8EeIrOvv72miheon9xsERH2LiIeJHU1nf53xRmjp1WQcYX-SodT_UNC321hJrh4AKbXEUhiyuenq3qAs2FQY' });

//       if (token) {
//         console.log('FCM Token:', token);
//         await sendTokenToBackend(email, token);
//       } else {
//         console.log('No registration token available.');
//       }
//     } else {
//       console.log('Notification permission denied.');
//     }
//   } catch (error) {
//     console.error('Error requesting notification permission:', error);
//   }
// };


  // Fetch ideas from the API
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch('http://localhost:3001/ideas');
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

    fetchIdeas();

    const intervalId = setInterval(() => {
      fetchIdeas();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  
  const handlePostNotification = async (e, email) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3001/notifications', {
        email: email,
        message: 'Test notification',
      });
      console.log('Notification posted successfully:', response.data);
    } catch (error) {
      console.error('Error posting notification:', error);
    }
  };
  

  const handleConfirm = async (e, ideaId) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const ideaToConfirm = ideas.find((idea) => idea._id === ideaId);
      if (!ideaToConfirm) {
        throw new Error('Idea not found');
      }

      // Confirm the idea
      await axios.post('http://localhost:3001/confirmidea', {
        idea: ideaToConfirm.idea,
        email: ideaToConfirm.email,
      });

      // Update the confirmation status
      await handleConfirmStatus(ideaId);
     handlePostNotification(e,ideaToConfirm.email);
      setAlertMessage('Idea submitted successfully!');
     // handleSendNotification(ideaToConfirm.email);
     // sendNotification(ideaToConfirm.email,"fdsfs","fdfsd")
    } catch (error) {
      console.error('Error confirming idea:', error);
      setAlertMessage('Error confirming idea.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleSendNotification = async (email) => {
  //   try {
  //     const firebaseToken = await getFirebaseToken();
  //     const userEmail = email; // Replace with the actual user email or get it dynamically
  
  //     console.log("Firebase Token:", firebaseToken); // Add this line to check if the token is valid
  
  //     if (!firebaseToken) {
  //       console.error("Firebase token is missing or invalid");
  //       return;
  //     }
  
  //     const response = await axios.post('http://localhost:3001/send-notification', {
  //       email: userEmail,  // Add email here
  //       title: 'New Notification',
  //       body: 'This is a test notification from your Dashboard.',
  //       token: firebaseToken,  // Ensure firebaseToken is not undefined or empty
  //     });
  
  //     if (response.status === 200) {
  //       alert('Notification sent successfully!');
  //     } else {
  //       alert('Failed to send notification.');
  //     }
  //   } catch (error) {
  //     console.error('Error sending notification:', error);
  //     alert('Error sending notification.');
  //   }
  // };
  

  const handleConfirmStatus = async (ideaId) => {
    setIsSubmitting(true); // Start submitting state

    console.log("idea Status id", ideaId)
    try {
      const response = await axios.patch(`http://localhost:3001/ideas/${ideaId}`, {
        ideaConfirmStatus: true, // Set ideaConfirmStatus to true
      });

      if (response.status === 200) {
        
      }
    } catch (error) {
      setAlertMessage('Error confirming idea');
      console.error('Error confirming idea:', error);
    } finally {
      setIsSubmitting(false); // End submitting state
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        const response = await fetch(`http://localhost:3001/ideas/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete the idea');
        }
        setIdeas(ideas.filter((idea) => idea._id !== id));
        alert('Idea deleted successfully!');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCloseAlert = () => setAlertMessage(null);
  const handleCloseNotification = () => setUserNotification('');

  if (loading) return <div>Loading ideas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="ideas-container">
      <h2>Submitted Ideas</h2>
      {ideas.length === 0 ? (
        <p>No ideas found</p>
      ) : (
        <div className="ideas-list">
          {ideas.map((idea) => (
            <div key={idea._id} className="idea-card">
              <div className="idea-content">
                <p><strong>Idea:</strong> {idea.idea}</p>
                <p><strong>Submitted By:</strong> {idea.email}</p>
                <p><small>Submitted At: {new Date(idea.createdAt).toLocaleString()}</small></p>
              </div>
              {!idea.ideaConfirmStatus && (
                <div className="idea-buttons">
                  <button
                    className="confirm-btn"
                    onClick={(e) => handleConfirm(e, idea._id)}
                    disabled={isSubmitting}
                  >
                    Confirm
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(idea._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Alert Dialog for Actions */}
      {alertMessage && <AlertDialog message={alertMessage} onClose={handleCloseAlert} />}

      {/* Notification for Idea Confirmation */}
      {userNotification && (
        <div className="notification">
          <p>{userNotification}</p>
          <button onClick={handleCloseNotification}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Ideas;
