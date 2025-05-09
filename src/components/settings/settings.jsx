import React from 'react';
import './Settings.css';

const Settings = ({ user, setUser }) => {
  const handleDeleteUser = () => {
    console.log('User deleted:', user);
    setUser({ user: "", userID: "", isLoggedIn: false }); // Log out the user
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        <section className="user-section">
          <h2 className="section-title">Logged In User</h2>
          {user && user.isLoggedIn ? (
            <div className="user-details">
              <p><strong>Username:</strong> {user.user}</p>
              <p><strong>User ID:</strong> {user.userID}</p>
              <button className="delete-button" onClick={handleDeleteUser}>
                Delete User
              </button>
            </div>
          ) : (
            <p className="no-user-text">No user is logged in.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Settings;
