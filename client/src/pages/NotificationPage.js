
import React, { useEffect, useState ,useContext} from 'react';
import {UserContext} from "../UserContext";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);

  const {setUserInfo,userInfo} = useContext(UserContext);

  useEffect(() => {
    fetch('http://localhost/user/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  const username = userInfo?.username;

  useEffect(() => {
    // Fetch notifications from the server
    fetch('http://localhost/notification/notifications') 
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to fetch notifications');
      })
      .then((data) => {
        setNotifications(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification) => {
          if(notification?.username == userInfo?.username) {
            return <div></div>;
          }
          return (
          <li key={notification._id}>
            {/* Display notification information */}
            <div>{notification?.username}</div>
            <div>{notification?.title}</div>
            <div>{notification?.createdAt}</div>
          </li>
        )})}
      </ul>
    </div>
  );
}

export default NotificationPage;
