import React, { useState } from "react";
import "./portfolio.css";

const portfolios = ["Technology", "Real Estate", "Healthcare", "Industrials", "Financials", "Communication Services", "Board Market Indices", "Global & International Indices"];

const Portfolio = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState(portfolios[0]); // Default selection

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>SELECT PORTFOLIO</h3>
        <div className="portfolio-list">
          {portfolios.map((portfolio, index) => (
            <button
              key={index}
              className={`portfolio-item ${selectedPortfolio === portfolio ? "active" : ""}`}
              onClick={() => setSelectedPortfolio(portfolio)}
            >
              {portfolio}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>{selectedPortfolio}</h1>
        <p>Welcome to the {selectedPortfolio} Portfolio page!</p>
        {/* Here you can load more specific data for each portfolio if needed */}
      </div>
    </div>
  );
};

export default Portfolio;