import React, { useState } from "react";
import "./portfolio.css";

const Portfolio = () => {
  // Sample portfolio data - in a real app this would come from an API
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 125750.38,
    dayChange: 1850.25,
    dayChangePercent: 1.49,
    holdings: [
      {
        ticker: "AAPL",
        shares: 25,
        avgPrice: 180.5,
        currentPrice: 212.0,
        value: 5300.0,
      },
      {
        ticker: "MSFT",
        shares: 15,
        avgPrice: 350.25,
        currentPrice: 383.0,
        value: 5745.0,
      },
      {
        ticker: "GOOGL",
        shares: 10,
        avgPrice: 132.75,
        currentPrice: 160.0,
        value: 1600.0,
      },
      {
        ticker: "AMZN",
        shares: 20,
        avgPrice: 178.3,
        currentPrice: 192.0,
        value: 3840.0,
      },
      {
        ticker: "TSLA",
        shares: 30,
        avgPrice: 190.8,
        currentPrice: 225.0,
        value: 6750.0,
      },
      {
        ticker: "META",
        shares: 12,
        avgPrice: 510.25,
        currentPrice: 582.0,
        value: 6984.0,
      },
    ],
    watchlist: [
      { ticker: "NVDA", price: 115.0, change: 3.25, changePercent: 2.91 },
      { ticker: "JPM", price: 234.0, change: -1.5, changePercent: -0.64 },
      { ticker: "V", price: 334.0, change: 5.75, changePercent: 1.75 },
      { ticker: "JNJ", price: 164.0, change: 0.25, changePercent: 0.15 },
    ],
  });

  return (
    <div className="portfolio-container">
      <h1 className="portfolio-title">Your Portfolio</h1>

      <div className="portfolio-summary glass-card">
        <div className="summary-item">
          <h3>Total Value</h3>
          <p className="summary-value">
            $
            {portfolioData.totalValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="summary-item">
          <h3>Today's Change</h3>
          <p
            className={`summary-value ${
              portfolioData.dayChange >= 0 ? "positive" : "negative"
            }`}
          >
            $
            {Math.abs(portfolioData.dayChange).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            ({portfolioData.dayChange >= 0 ? "+" : "-"}
            {Math.abs(portfolioData.dayChangePercent).toFixed(2)}%)
          </p>
        </div>
      </div>

      <h2 className="section-title">Your Holdings</h2>
      <div className="portfolio-table-container glass-card">
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Shares</th>
              <th>Avg. Price</th>
              <th>Current Price</th>
              <th>Value</th>
              <th>Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {portfolioData.holdings.map((stock) => {
              const gainLoss =
                ((stock.currentPrice - stock.avgPrice) / stock.avgPrice) * 100;
              return (
                <tr key={stock.ticker}>
                  <td>{stock.ticker}</td>
                  <td>{stock.shares}</td>
                  <td>${stock.avgPrice.toFixed(2)}</td>
                  <td>${stock.currentPrice.toFixed(2)}</td>
                  <td>
                    $
                    {stock.value.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className={gainLoss >= 0 ? "positive" : "negative"}>
                    {gainLoss >= 0 ? "+" : ""}
                    {gainLoss.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;
