import React, { useState } from "react";
import "./portfolio.css";
import { 
  portfolioData, 
  companyNames, 
  formatCurrency, 
  formatPercentage, 
  formatStrategy,
  calculatePortfolioTotal,
  calculatePortfolioProfitLoss,
  calculatePortfolioProfitLossPercentage,
  calculatePositionDetails
} from "./portfolio_data";

const Portfolio = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState(portfolioData[0]); // Default selection

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>SELECT PORTFOLIO</h3>
        <div className="portfolio-list">
          {portfolioData.map((portfolio) => (
            <button
              key={portfolio.portfolio_id}
              className={`portfolio-item ${selectedPortfolio.portfolio_id === portfolio.portfolio_id ? "active" : ""}`}
              onClick={() => setSelectedPortfolio(portfolio)}
            >
              {portfolio.portfolio_name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
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
          {selectedPortfolio.positions.map((position) => {
            const details = calculatePositionDetails(position);
            
            return (
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
                
                <div className="company-name">{companyNames[position.ticker]}</div>
                
                <div className="position-value-section">
                  <div className="total-value">
                    <span className="value-label">Market Value</span>
                    <span className="value-amount">{formatCurrency(details.marketValue)}</span>
                  </div>
                  
                  <div className="profit-loss-info">
                    <span className={`profit-loss-value ${details.profitLoss >= 0 ? 'positive' : 'negative'}`}>
                      {formatCurrency(details.profitLoss)} ({formatPercentage(details.profitLossPercentage)})
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
                      <span className="detail-value">{formatCurrency(details.costBasis)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;