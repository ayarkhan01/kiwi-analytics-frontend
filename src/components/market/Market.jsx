import React, { useState, useEffect } from "react";
import "./Market.css";
import { portfolioData } from "../portfolio/portfolio_data";

// Sample market data - would come from your backend API eventually
const marketStocksData = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 211.21,
    change: 0.51,
    marketCap: "3.48T",
    sector: "Technology"
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp.",
    price: 394.04,
    change: 0.74,
    marketCap: "2.93T",
    sector: "Technology"
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    price: 160.16,
    change: -0.28,
    marketCap: "1.95T",
    sector: "Technology"
  },
  {
    ticker: "AMZN",
    name: "Amazon.com Inc.",
    price: 176.35,
    change: 1.21,
    marketCap: "1.84T",
    sector: "Consumer Cyclical"
  },
  {
    ticker: "META",
    name: "Meta Platforms Inc.",
    price: 554.44,
    change: 0.85,
    marketCap: "1.38T",
    sector: "Technology"
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    price: 292.03,
    change: 2.15,
    marketCap: "930.01B",
    sector: "Automotive"
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    price: 874.15,
    change: 3.05,
    marketCap: "2.15T",
    sector: "Technology"
  },
  {
    ticker: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 182.37,
    change: -0.43,
    marketCap: "523.60B",
    sector: "Financial Services"
  },
  {
    ticker: "WMT",
    name: "Walmart Inc.",
    price: 69.23,
    change: 0.36,
    marketCap: "557.80B",
    sector: "Consumer Defensive"
  },
  {
    ticker: "JNJ",
    name: "Johnson & Johnson",
    price: 148.56,
    change: -0.78,
    marketCap: "357.99B",
    sector: "Healthcare"
  },
  {
    ticker: "DIS",
    name: "The Walt Disney Co.",
    price: 113.44,
    change: 1.37,
    marketCap: "207.45B",
    sector: "Communication Services"
  },
  {
    ticker: "PFE",
    name: "Pfizer Inc.",
    price: 27.42,
    change: -0.65,
    marketCap: "155.24B",
    sector: "Healthcare"
  }
];

const Market = () => {
  // State management
  const [marketStocks, setMarketStocks] = useState(marketStocksData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedPortfolio, setSelectedPortfolio] = useState(portfolioData[0].portfolio_id);
  
  // Get unique sectors for filter
  const sectors = ["All", ...new Set(marketStocksData.map(stock => stock.sector))];
  
  // Filter stocks based on search and sector
  useEffect(() => {
    let filteredStocks = [...marketStocksData];
    
    // Apply search filter
    if (searchTerm) {
      filteredStocks = filteredStocks.filter(
        stock => 
          stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sector filter
    if (selectedSector !== "All") {
      filteredStocks = filteredStocks.filter(
        stock => stock.sector === selectedSector
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filteredStocks.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    
    setMarketStocks(filteredStocks);
  }, [searchTerm, selectedSector, sortConfig]);
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  
  // Open add stock modal
  const handleAddClick = (stock) => {
    setSelectedStock(stock);
    setQuantity(1);
    setIsAddModalOpen(true);
  };
  
  // Handle adding stock to portfolio
  const handleAddStock = () => {
    // This would connect to your backend API
    console.log(`Adding ${quantity} shares of ${selectedStock.ticker} to portfolio ${selectedPortfolio}`);
    
    // Close modal
    setIsAddModalOpen(false);
    
    // Show success message (would be implemented with a toast notification)
    alert(`Added ${quantity} shares of ${selectedStock.ticker} to your portfolio`);
  };
  
  return (
    <div className="market-container">
      <div className="market-header">
        <h1>Market</h1>
        <p className="market-subheader">Browse and add stocks to your portfolios</p>
      </div>
      
      <div className="market-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by ticker or company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="market-search"
          />
        </div>
        
        <div className="sector-filter">
          <label htmlFor="sector-select">Sector:</label>
          <select
            id="sector-select"
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="sector-select"
          >
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="stocks-table-container">
        <table className="stocks-table">
          <thead>
            <tr>
              <th onClick={() => requestSort("ticker")}>
                Ticker {sortConfig.key === "ticker" && (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th onClick={() => requestSort("name")}>
                Company {sortConfig.key === "name" && (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th onClick={() => requestSort("price")}>
                Price {sortConfig.key === "price" && (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th onClick={() => requestSort("change")}>
                24h Change {sortConfig.key === "change" && (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th onClick={() => requestSort("marketCap")}>
                Market Cap {sortConfig.key === "marketCap" && (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th onClick={() => requestSort("sector")}>
                Sector {sortConfig.key === "sector" && (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {marketStocks.map((stock) => (
              <tr key={stock.ticker}>
                <td className="ticker-cell">{stock.ticker}</td>
                <td>{stock.name}</td>
                <td>${stock.price.toFixed(2)}</td>
                <td className={stock.change >= 0 ? "positive-change" : "negative-change"}>
                  {stock.change >= 0 ? "+" : ""}{stock.change}%
                </td>
                <td>{stock.marketCap}</td>
                <td>{stock.sector}</td>
                <td>
                  <button 
                    className="add-stock-btn"
                    onClick={() => handleAddClick(stock)}
                  >
                    Add to Portfolio
                  </button>
                </td>
              </tr>
            ))}
            {marketStocks.length === 0 && (
              <tr>
                <td colSpan="7" className="no-results">
                  No stocks match your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add Stock Modal */}
      {isAddModalOpen && selectedStock && (
        <div className="modal-backdrop">
          <div className="add-stock-modal">
            <h2>Add {selectedStock.ticker} to Portfolio</h2>
            <p className="stock-info">{selectedStock.name} - ${selectedStock.price.toFixed(2)}</p>
            
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="portfolio-select">Select Portfolio:</label>
                <select 
                  id="portfolio-select"
                  value={selectedPortfolio}
                  onChange={(e) => setSelectedPortfolio(Number(e.target.value))}
                  className="portfolio-select"
                >
                  {portfolioData.map(portfolio => (
                    <option key={portfolio.portfolio_id} value={portfolio.portfolio_id}>
                      {portfolio.portfolio_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="quantity-input">Quantity:</label>
                <div className="quantity-control">
                  <button 
                    className="quantity-btn"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <input
                    id="quantity-input"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="quantity-input"
                  />
                  <button 
                    className="quantity-btn"
                    onClick={() => setQuantity(prev => prev + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="transaction-summary">
                <div className="summary-row">
                  <span>Price per Share:</span>
                  <span>${selectedStock.price.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Total Shares:</span>
                  <span>{quantity}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Cost:</span>
                  <span>${(selectedStock.price * quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={handleAddStock}
              >
                Add to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;