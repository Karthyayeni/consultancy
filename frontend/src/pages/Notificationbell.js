import axios from 'axios';
import { useState } from 'react';
import './NotificationBell.css'; // basic styles


const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  console.log(userId);

  const fetchNotifications = async () => {
  try {
    const response = await axios.get(`https://consultancy-1-tdn6.onrender.com/admin/notifications/${userId}`);
    setNotifications(response.data);
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};


  const markAllAsRead = async () => {
    await axios.put(`https://consultancy-1-tdn6.onrender.com/api/notifications/mark-read/${userId}`);
    fetchNotifications();
  };

  

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-container">
      <div className="icon" onClick={() => setShowDropdown(!showDropdown)}>
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>

      {showDropdown && (
        <div className="dropdown">
          <button onClick={markAllAsRead}>Mark all as read</button>
          <ul>
            {notifications.length === 0 && <li>No notifications</li>}
            {notifications.map((n, idx) => (
              <li key={idx} className={n.read ? 'read' : 'unread'}>
                {n.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
