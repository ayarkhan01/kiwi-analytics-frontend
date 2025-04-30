import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
    const [user, setUser] = useState({
        id: 1,
        username: 'goodtrader1',
        password: 'strongpassword123',
    });

    const [portfolios, setPortfolios] = useState([
        { id: 1, name: 'Portfolio 1' },
        { id: 2, name: 'Portfolio 2' },
        { id: 3, name: 'Portfolio 3' },
    ]);

    const handleDeleteUser = () => {
        console.log('User deleted:', user);
        setUser(null);
    };

    const handleDeletePortfolio = (portfolioId) => {
        const updatedPortfolios = portfolios.filter((p) => p.id !== portfolioId);
        setPortfolios(updatedPortfolios);
        console.log('Portfolio deleted:', portfolioId);
    };

    return (
    <div className="settings-page">
        <div className="settings-container">
            <h1 className="settings-title">Settings</h1>

            <section className="user-section">
                <h2 className="section-title">Logged In User</h2>
                {user ? (
                    <div className="user-details">
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Password:</strong> {user.password}</p>
                        <button className="delete-button" onClick={handleDeleteUser}>
                            Delete User
                        </button>
                    </div>
                ) : (
                    <p className="no-user-text">No user is logged in.</p>
                )}
            </section>

            <section className="portfolios-section">
                <h2 className="section-title">Portfolios</h2>
                {portfolios.length > 0 ? (
                    <ul className="portfolio-list">
                        {portfolios.map((portfolio) => (
                            <li key={portfolio.id} className="portfolio-item">
                                {portfolio.name}
                                <button
                                    className="delete-button small"
                                    onClick={() => handleDeletePortfolio(portfolio.id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-portfolios-text">No portfolios available.</p>
                )}
            </section>
        </div>
    </div>
    );
};

export default Settings;
