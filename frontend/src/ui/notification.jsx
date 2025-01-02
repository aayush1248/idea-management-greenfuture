import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa'; // Notification bell icon
import '../css/notification.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const emails = localStorage.getItem('userEmail');


  useEffect(() => {
    // Fetch notifications from the backend
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:3001/notifications/${emails}`);
        const data = await response.json();
        if (response.ok) {
          setNotifications(data);
          setUnreadCount(data.filter((notif) => !notif.read).length);
        } else {
          console.error('Error fetching notifications:', data.error);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [emails]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => prev - 1);
  };

  const clearNotifications = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="notifications-container">
      <button className="notifications-btn" onClick={toggleDropdown}>
        <FaBell />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isDropdownOpen && (
        <div className="notifications-dropdown">
          <ul>
            {notifications.length === 0 && <li>No new notifications</li>}
            {notifications.map((notif) => (
              <li
                key={notif._id}
                className={notif.read ? 'read' : 'unread'}
                onClick={() => markAsRead(notif._id)}
              >
                {notif.message}
              </li>
            ))}
          </ul>
          {unreadCount > 0 && (
            <button onClick={clearNotifications} className="clear-notifications">
              Mark all as read
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
