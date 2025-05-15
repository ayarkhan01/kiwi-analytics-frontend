import React, { useState, useEffect } from "react";
import "./portfolio.css";
import { 
  formatCurrency, 
  formatPercentage, 
  formatStrategy,
  calculatePortfolioTotal,
  calculatePortfolioProfitLoss,
  calculatePortfolioProfitLossPercentage
} from "./portfolio_data";
import AddPortfolioModal from "./AddPortfolioModal";

const Portfolio = ({ userId }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch portfolios from API
  useEffect(() => {
    const fetchPortfolios = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`http://127.0.0.1:5000/api/portfolios/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        setPortfolios(data);
        
        // Set default selected portfolio if we have portfolios
        if (data.length > 0) {
          setSelectedPortfolio(data[0]);
        }
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch portfolios:", err);
        setError("Failed to load portfolios. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPortfolios();
  }, [userId]);

  // Function to handle adding a new portfolio
  const handleAddPortfolio = async (portfolioData) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/portfolios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          portfolio_name: portfolioData.name,
          strategy: portfolioData.strategy
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create portfolio');
      }

      const newPortfolio = await response.json();
      
      // Update portfolios state with the new portfolio
      const updatedPortfolios = [...portfolios, newPortfolio];
      setPortfolios(updatedPortfolios);
      
      // Select the newly created portfolio
      setSelectedPortfolio(newPortfolio);
      
      // Close modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating portfolio:", error);
      // You could add a toast notification here for error feedback
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="main-content" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading portfolios...</h2>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="main-content" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button 
            className="add-portfolio-button" 
            onClick={() => window.location.reload()}
            style={{ maxWidth: '200px', margin: '20px auto' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render empty state
  if (portfolios.length === 0) {
    return (
      <div className="dashboard-container">
        <div className="main-content" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>No portfolios found</h2>
          <p>Create a new portfolio to get started</p>
          <button 
            className="add-portfolio-button" 
            onClick={() => setIsModalOpen(true)}
            style={{ maxWidth: '200px', margin: '20px auto' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Portfolio
          </button>
        </div>
        
        {/* Add Portfolio Modal */}
        <AddPortfolioModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAddPortfolio={handleAddPortfolio} 
        />
      </div>
    );
  }

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
      {selectedPortfolio && (
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
            {selectedPortfolio.positions && selectedPortfolio.positions.length > 0 ? (
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
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-portfolio-message">
                <p>This portfolio has no positions yet. Visit the Market page to add stocks.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Add Portfolio Modal */}
      <AddPortfolioModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddPortfolio={handleAddPortfolio} 
      />
    </div>
  );
};

export default Portfolio;