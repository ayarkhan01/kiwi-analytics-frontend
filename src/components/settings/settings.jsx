import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = ({ user, setUser }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolios = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:5000/api/portfolios/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.userID }),
        });

        if (response.ok) {
          const data = await response.json();
          setPortfolios(data);
        } else {
          toast.error('Failed to fetch portfolios');
        }
      } catch (error) {
        toast.error('Error fetching portfolios');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.userID) {
      fetchPortfolios();
    }
  }, [user]);

  const handleDeletePortfolio = async (portfolioId) => {
    const confirmed = window.confirm('Are you sure you want to delete this portfolio?');
    if (!confirmed) return;

    try {
      const response = await fetch('http://127.0.0.1:5000/api/portfolios/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolio_id: portfolioId }),
      });

      if (response.ok) {
        setPortfolios((prev) => prev.filter((p) => p.portfolio_id !== portfolioId));
        toast.success('Portfolio deleted successfully');
      } else {
        const error = await response.json();
        toast.error(`Failed to delete portfolio: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('Error deleting portfolio');
    }
  };

  const handleDeleteUser = async () => {
    const confirmed = window.confirm('Are you sure you want to delete the user, its associated portfolios and positions and log out?');
    if (!confirmed) return;

    try {
      const response = await fetch('http://127.0.0.1:5000/api/delete_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.userID }),
      });

      if (response.ok) {
        toast.success('User deleted successfully');
        setUser({ user: '', userID: '', isLoggedIn: false });
        navigate('/login'); // ✅ Redirect to login page
      } else {
        const error = await response.json();
        toast.error(`Failed to delete user: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('Error deleting user');
    }
  };

  return (
    <div className="settings-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        <section className="user-section">
          <h2 className="section-title">Logged In User</h2>
          {user && user.isLoggedIn ? (
            <div className="user-details">
              <p><strong>Username:</strong> {user.user}</p>
              <button className="delete-button" onClick={handleDeleteUser}>
                Delete User
              </button>
            </div>
          ) : (
            <p className="no-user-text">No user is logged in.</p>
          )}
        </section>

        <section className="portfolio-section">
          <h2 className="section-title">Your Portfolios</h2>
          {loading ? (
            <div className="spinner"></div>
          ) : portfolios.length > 0 ? (
            <ul className="portfolio-list">
              {portfolios.map((portfolio) => (
                <li key={portfolio.portfolio_id} className="portfolio-item">
                  <div>
                    <strong>{portfolio.portfolio_name}</strong> —{' '}
                    {portfolio.strategy === 'long_term'
                      ? 'Long Term'
                      : portfolio.strategy === 'short_term'
                      ? 'Short Term'
                      : portfolio.strategy}
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDeletePortfolio(portfolio.portfolio_id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-portfolios-text">No portfolios found.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Settings;
