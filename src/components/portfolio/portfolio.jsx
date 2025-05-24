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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Portfolio = ({ userId, balance, setUser }) => {

  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(1);

  // Fetch portfolios from API
  useEffect(() => {
    const fetchPortfolios = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`http://127.0.0.1:5001/api/portfolios/user`, {
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
        
        // Ensure each portfolio has a positions array
        const portfoliosWithPositions = data.map(portfolio => ({
          ...portfolio,
          positions: portfolio.positions || []
        }));
        
        setPortfolios(portfoliosWithPositions);
        
        // Set default selected portfolio if we have portfolios
        if (portfoliosWithPositions.length > 0) {
          setSelectedPortfolio(portfoliosWithPositions[0]);
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
      console.log("Submitting portfolio:", portfolioData); // Debug
      
      const response = await fetch('http://127.0.0.1:5001/api/portfolios/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          name: portfolioData.name,
          strategy: portfolioData.strategy
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create portfolio');
      }

      const newPortfolio = await response.json();
      
      // Ensure the new portfolio has a positions array
      const portfolioWithPositions = {
        ...newPortfolio,
        positions: []
      };
      
      // Update portfolios state with the new portfolio
      setPortfolios([...portfolios, portfolioWithPositions]);
      
      // Select the newly created portfolio
      setSelectedPortfolio(portfolioWithPositions);
      
      // Close modal
      setIsModalOpen(false);
      
      // Show success toast
      toast.success("Portfolio created successfully!");
    } catch (error) {
      console.error("Error creating portfolio:", error);
      toast.error(`Failed to create portfolio: ${error.message}`);
    }
  };

  // Function to handle selling a position
  const handleSellPosition = async () => {
    if (!selectedPosition || !sellQuantity) {
      toast.error('Please select a quantity to sell');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5001/api/portfolios/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolio_id: selectedPortfolio.portfolio_id,
          ticker: selectedPosition.ticker,
          quantity: sellQuantity,
          price: selectedPosition.market_value / selectedPosition.quantity // Calculate current price per share
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sell position');
      }

      // After successful sale, fetch updated balance
      const balanceResponse = await fetch('http://127.0.0.1:5001/api/user/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json();
        // Update the balance in the parent component
        setUser(prevUser => ({
          ...prevUser,
          balance: balanceData.balance
        }));
      }

      // Refresh portfolios to update positions
      const portfoliosResponse = await fetch('http://127.0.0.1:5001/api/portfolios/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (portfoliosResponse.ok) {
        const updatedPortfolios = await portfoliosResponse.json();
        setPortfolios(updatedPortfolios);
        // Update selected portfolio with new data
        const updatedSelectedPortfolio = updatedPortfolios.find(
          p => p.portfolio_id === selectedPortfolio.portfolio_id
        );
        if (updatedSelectedPortfolio) {
          setSelectedPortfolio(updatedSelectedPortfolio);
        }
      }

      toast.success('Position sold successfully!');
      setIsSellModalOpen(false);
      setSellQuantity(1);
    } catch (error) {
      console.error('Error selling position:', error);
      toast.error(error.message || 'Failed to sell position');
    }
  };

  // Quantity handlers
  const decreaseQuantity = () => {
    setSellQuantity(prev => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setSellQuantity(prev => Math.min(selectedPosition.quantity, prev + 1));
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setSellQuantity(Math.min(selectedPosition.quantity, Math.max(1, value)));
  };

  const openSellModal = (position) => {
    setSelectedPosition(position);
    setSellQuantity(1);
    setIsSellModalOpen(true);
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
        <ToastContainer />
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
      <ToastContainer />
      {/* Sidebar */}
      <div className="sidebar">
        <h3>SELECT PORTFOLIO</h3>
        <div className="portfolio-list">
          {portfolios.map((portfolio) => (
            <button
              key={portfolio.portfolio_id || portfolio.id}
              className={`portfolio-item ${
                (selectedPortfolio?.portfolio_id || selectedPortfolio?.id) === 
                (portfolio.portfolio_id || portfolio.id) ? "active" : ""
              }`}
              onClick={() => setSelectedPortfolio(portfolio)}
            >
              {portfolio.portfolio_name || portfolio.name}
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
  <div className="portfolio-title-group">
    <div className="portfolio-title-section">
      <h1>{selectedPortfolio.portfolio_name || selectedPortfolio.name}</h1>
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

    {/* Account Balance */}
    <div className="portfolio-balance">
      <span className="balance-label">Account Balance:</span>
      <span className="balance-value">${balance?.toFixed(2)}</span>
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
                <div key={position.ticker} className="position-card">
                  <div className="position-header">
                    <div className="position-title">
                      <h3>{position.ticker}</h3>
                      <span className="position-name">{position.name}</span>
                    </div>
                    <button 
                      className="sell-button"
                      onClick={() => openSellModal(position)}
                    >
                      Sell
                    </button>
                  </div>
                  
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

      {/* Sell Stock Modal */}
      {isSellModalOpen && selectedPosition && (
        <div className="modal-backdrop">
          <div className="add-stock-modal">
            <h2>Sell {selectedPosition.ticker}</h2>
            <p className="stock-info">{selectedPosition.name} - ${(selectedPosition.market_value / selectedPosition.quantity).toFixed(2)}</p>
            
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="quantity-input">Quantity to Sell:</label>
                <div className="quantity-control">
                  <button 
                    className="quantity-btn"
                    onClick={decreaseQuantity}
                  >
                    -
                  </button>
                  <input
                    id="quantity-input"
                    type="number"
                    min="1"
                    max={selectedPosition.quantity}
                    value={sellQuantity}
                    onChange={handleQuantityChange}
                    className="quantity-input"
                  />
                  <button 
                    className="quantity-btn"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>
                </div>
                <p className="available-shares">Available shares: {selectedPosition.quantity}</p>
              </div>
              
              <div className="transaction-summary">
                <div className="summary-row">
                  <span>Price per Share:</span>
                  <span>${(selectedPosition.market_value / selectedPosition.quantity).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shares to Sell:</span>
                  <span>{sellQuantity}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Value:</span>
                  <span>${((selectedPosition.market_value / selectedPosition.quantity) * sellQuantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setIsSellModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={handleSellPosition}
              >
                Sell Shares
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;