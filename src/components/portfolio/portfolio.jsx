import React, { useState } from "react";
import "./portfolio.css";
import {
  portfolioData as initialPortfolioData,
  formatCurrency,
  formatPercentage,
  formatStrategy,
  calculatePortfolioTotal,
  calculatePortfolioProfitLoss,
  calculatePortfolioProfitLossPercentage
} from "./portfolio_data";
import AddPortfolioModal from "./AddPortfolioModal";

const Portfolio = () => {
<<<<<<< Updated upstream
  const [portfolios, setPortfolios] = useState(initialPortfolioData);
  const [selectedPortfolio, setSelectedPortfolio] = useState(initialPortfolioData[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  const handleAddPortfolio = () => {
    const newId = portfolios.length + 1;
    const newPortfolio = {
      portfolio_id: newId,
      portfolio_name: `New Portfolio ${newId}`,
      strategy: "Long Term",
      positions: []
    };
    setPortfolios([...portfolios, newPortfolio]);
    setSelectedPortfolio(newPortfolio);
  };

  const handleModifyName = () => {
    setIsEditing(true);
    setEditName(selectedPortfolio.portfolio_name);
  };

  const handleModifyNameSubmit = () => {
    const updatedPortfolios = portfolios.map((portfolio) =>
      portfolio.portfolio_id === selectedPortfolio.portfolio_id
        ? { ...portfolio, portfolio_name: editName }
        : portfolio
    );
    setPortfolios(updatedPortfolios);
    setSelectedPortfolio({ ...selectedPortfolio, portfolio_name: editName });
    setIsEditing(false);
  };

  const handleDelete = () => {
    const filteredPortfolios = portfolios.filter(
      (portfolio) => portfolio.portfolio_id !== selectedPortfolio.portfolio_id
    );
    setPortfolios(filteredPortfolios);
    if (filteredPortfolios.length > 0) {
      setSelectedPortfolio(filteredPortfolios[0]);
    } else {
      setSelectedPortfolio(null);
    }
  };

  const handleAddStock = (positionId) => {
    const updatedPositions = selectedPortfolio.positions.map((position) => {
      if (position.id === positionId) {
        return { ...position, quantity: position.quantity + 1 };
      }
      return position;
    });
    setSelectedPortfolio({ ...selectedPortfolio, positions: updatedPositions });
  };

  const handleRemoveStock = (positionId) => {
    const updatedPositions = selectedPortfolio.positions.map((position) => {
      if (position.id === positionId && position.quantity > 1) {
        return { ...position, quantity: position.quantity - 1 };
      }
      return position;
    }).filter((position) => position.quantity > 0);
    setSelectedPortfolio({ ...selectedPortfolio, positions: updatedPositions });
  };

  const handleDeleteStock = (positionId) => {
    const updatedPositions = selectedPortfolio.positions.filter(
      (position) => position.id !== positionId
    );
    setSelectedPortfolio({ ...selectedPortfolio, positions: updatedPositions });
  };

  const handleAddNewStock = () => {
    // Replace this with a proper modal or form logic
    alert("Open a modal to input new stock data here.");
  };
=======
  const [portfolios, setPortfolios] = useState(portfolioData); // State to hold portfolios
  const [selectedPortfolio, setSelectedPortfolio] = useState(portfolioData[0]); // Default selection
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle adding a new portfolio
  const handleAddPortfolio = async (portfolioData) => {
    try {
      // Here you would make your API call to create a portfolio
      // Example API call (replace with your actual implementation):
      // const response = await fetch('/api/portfolios', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     name: portfolioData.name,
      //     strategy: portfolioData.strategy
      //   }),
      // });
      // const data = await response.json();
      
      // For now, we'll simulate a response with a new portfolio
      const newPortfolio = {
        portfolio_id: portfolios.length + 1,
        portfolio_name: portfolioData.name,
        strategy: portfolioData.strategy,
        positions: [] // New portfolio starts with no positions
      };
      
      // Update portfolios state with the new portfolio
      const updatedPortfolios = [...portfolios, newPortfolio];
      setPortfolios(updatedPortfolios);
      
      // Select the newly created portfolio
      setSelectedPortfolio(newPortfolio);
      
      // Show success message (you could use a toast notification here)
      console.log("Portfolio created successfully:", newPortfolio);
    } catch (error) {
      console.error("Error creating portfolio:", error);
      // Handle error (show error message to user)
    }
  };
>>>>>>> Stashed changes

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>SELECT PORTFOLIO</h3>
        <div className="portfolio-list">
          {portfolios.map((portfolio) => (
            <button
              key={portfolio.portfolio_id}
              className={`portfolio-item ${selectedPortfolio?.portfolio_id === portfolio.portfolio_id ? "active" : ""}`}
              onClick={() => setSelectedPortfolio(portfolio)}
            >
              {portfolio.portfolio_name}
            </button>
          ))}
          <button className="add-portfolio-button" onClick={handleAddPortfolio}>
            + Add Portfolio
          </button>
        </div>
        
        {/* Add Portfolio Button */}
        <button 
          className="add-portfolio-button"
          onClick={() => setIsModalOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Portfolio
        </button>
      </div>

      {/* Main Content */}
<<<<<<< Updated upstream
      {selectedPortfolio && (
        <div className="main-content">
          <div className="portfolio-header">
            <div className="portfolio-title-section">
              {isEditing ? (
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="rename-input"
                  />
                  <button onClick={handleModifyNameSubmit} className="save-button">Save</button>
                </div>
              ) : (
                <>
                  <h1>{selectedPortfolio.portfolio_name}</h1>
                  <div className="portfolio-actions" style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                    <button onClick={handleModifyName} className="rename-button">Modify Name</button>
                    <button onClick={handleDelete} className="delete-button">Delete</button>
                  </div>
                </>
              )}
              <div className="portfolio-metrics">
                <div className="portfolio-total">
                  <span className="total-label">Current Value:</span>
                  <span className="total-amount">
                    {formatCurrency(calculatePortfolioTotal(selectedPortfolio))}
                  </span>
                </div>
                <div className="portfolio-profit-loss">
                  <span className="profit-loss-label">Total P/L:</span>
                  <span className={`profit-loss-amount ${calculatePortfolioProfitLoss(selectedPortfolio) >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(calculatePortfolioProfitLoss(selectedPortfolio))} ({formatPercentage(calculatePortfolioProfitLossPercentage(selectedPortfolio))})
                  </span>
=======
      <div className="main-content">
        <div className="portfolio-header">
          <div className="portfolio-title-section">
            <h1>{selectedPortfolio.portfolio_name}</h1>
            <div className="portfolio-metrics">
              <div className="portfolio-total">
                <span className="total-label">Current Value:</span>
                <span className="total-amount">{formatCurrency(calculatePortfolioTotal(selectedPortfolio))}</span>
              </div>
              <div className="portfolio-profit-loss">
                <span className="profit-loss-label">Total P/L:</span>
                <span className={`profit-loss-amount ${calculatePortfolioProfitLoss(selectedPortfolio) >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(calculatePortfolioProfitLoss(selectedPortfolio))} ({formatPercentage(calculatePortfolioProfitLossPercentage(selectedPortfolio))})
                </span>
              </div>
            </div>
          </div>
          <div className="view-selector">
            {formatStrategy(selectedPortfolio.strategy)}
          </div>
        </div>
        
        <div className="divider"></div>
        
        {/* Positions */}
        <div className="positions-container">
          {selectedPortfolio.positions.length > 0 ? (
            selectedPortfolio.positions.map((position) => (
              <div key={position.id} className="position-card">
                <div className="position-header">
                  <div className="position-ticker">
                    <span className="ticker">{position.ticker}</span>
                    <span className={`daily-change ${position.percent_change < 0 ? "negative" : "positive"}`}>
                      {formatPercentage(position.percent_change)}
                    </span>
                  </div>
                  <div className="position-price">
                    {formatCurrency(position.current_price)}
                  </div>
                </div>
                
                <div className="company-name">{position.name}</div>
                
                <div className="position-value-section">
                  <div className="total-value">
                    <span className="value-label">Market Value</span>
                    <span className="value-amount">{formatCurrency(position.market_value)}</span>
                  </div>
                  
                  <div className="profit-loss-info">
                    <span className={`profit-loss-value ${position.profit_loss >= 0 ? 'positive' : 'negative'}`}>
                      {formatCurrency(position.profit_loss)} ({formatPercentage(position.profit_loss_percent)})
                    </span>
                  </div>
                  
                  <div className="position-details">
                    <div className="detail-item">
                      <span className="detail-label">Quantity</span>
                      <span className="detail-value">{position.quantity}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Avg Price</span>
                      <span className="detail-value">{formatCurrency(position.average_price)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Cost Basis</span>
                      <span className="detail-value">{formatCurrency(position.cost_basis)}</span>
                    </div>
                  </div>
>>>>>>> Stashed changes
                </div>
              </div>
            ))
          ) : (
            <div className="empty-portfolio-message">
              <p>This portfolio has no positions yet.</p>
            </div>
<<<<<<< Updated upstream
            <div className="view-selector">
              {formatStrategy(selectedPortfolio.strategy)}
            </div>
          </div>

          <div className="divider"></div>

          {/* Positions */}
          <div className="positions-container">
            {selectedPortfolio.positions.map((position) => (
              <div key={position.id} className="position-card">
                {/* Delete Stock Button */}
                <button
                  className="delete-stock-btn"
                  onClick={() => handleDeleteStock(position.id)}
                >
                  &times;
                </button>

                <div className="position-header">
                  <div className="position-ticker">
                    <span className="ticker">{position.ticker}</span>
                    <span className={`daily-change ${position.percent_change < 0 ? "negative" : "positive"}`}>
                      {formatPercentage(position.percent_change)}
                    </span>
                  </div>
                  <div className="position-price">
                    {formatCurrency(position.current_price)}
                  </div>
                </div>

                <div className="company-name">{position.name}</div>

                <div className="position-value-section">
                  <div className="total-value">
                    <span className="value-label">Market Value</span>
                    <span className="value-amount">{formatCurrency(position.market_value)}</span>
                  </div>

                  <div className="profit-loss-info">
                    <span className={`profit-loss-value ${position.profit_loss >= 0 ? 'positive' : 'negative'}`}>
                      {formatCurrency(position.profit_loss)} ({formatPercentage(position.profit_loss_percent)})
                    </span>
                  </div>

                  <div className="position-details">
                    <div className="detail-item">
                      <span className="detail-label">Quantity</span>
                      <span className="detail-value">{position.quantity}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Avg Price</span>
                      <span className="detail-value">{formatCurrency(position.average_price)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Cost Basis</span>
                      <span className="detail-value">{formatCurrency(position.cost_basis)}</span>
                    </div>
                  </div>
                </div>

                <div className="stock-actions">
                  <button className="stock-action-btn add large" onClick={() => handleAddStock(position.id)}>+</button>
                  <button className="stock-action-btn remove large" onClick={() => handleRemoveStock(position.id)}>-</button>
                </div>
              </div>
            ))}

            {/* Add New Stock Card */}
            <div className="position-card add-stock-card" onClick={handleAddNewStock}>
              <div className="plus-sign">+</div>
            </div>
          </div>
        </div>
      )}
=======
          )}
        </div>
      </div>
      
      {/* Add Portfolio Modal */}
      <AddPortfolioModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddPortfolio={handleAddPortfolio} 
      />
>>>>>>> Stashed changes
    </div>
  );
};

export default Portfolio;
