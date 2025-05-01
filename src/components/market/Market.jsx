import React, { useState, useMemo, useEffect, useCallback } from "react";
import "./Market.css";
import { portfolioData } from "../portfolio/portfolio_data";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Sample market data - would come from your backend API eventually
const marketStocksData = [{'ticker': 'AAPL',
  'name': 'Apple Inc.',
  'price': 212.5,
  'change': 1.29,
  'marketCap': '3.19T',
  'sector': 'Technology'},
 {'ticker': 'MSFT',
  'name': 'Microsoft Corporation',
  'price': 395.26,
  'change': 1.22,
  'marketCap': '2.94T',
  'sector': 'Technology'},
 {'ticker': 'GOOGL',
  'name': 'Alphabet Inc.',
  'price': 158.8,
  'change': -1.36,
  'marketCap': '1.95T',
  'sector': 'Communication Services'},
 {'ticker': 'AMZN',
  'name': 'Amazon.com, Inc.',
  'price': 184.42,
  'change': -2.97,
  'marketCap': '1.99T',
  'sector': 'Consumer Cyclical'},
 {'ticker': 'META',
  'name': 'Meta Platforms, Inc.',
  'price': 549.0,
  'change': -5.44,
  'marketCap': '1.4T',
  'sector': 'Communication Services'},
 {'ticker': 'TSLA',
  'name': 'Tesla, Inc.',
  'price': 282.16,
  'change': -9.87,
  'marketCap': '940.62B',
  'sector': 'Consumer Cyclical'},
 {'ticker': 'NVDA',
  'name': 'NVIDIA Corporation',
  'price': 108.92,
  'change': -0.1,
  'marketCap': '2.66T',
  'sector': 'Technology'},
 {'ticker': 'JPM',
  'name': 'JP Morgan Chase & Co.',
  'price': 244.62,
  'change': 0.0,
  'marketCap': '679.82B',
  'sector': 'Financial Services'},
 {'ticker': 'WMT',
  'name': 'Walmart Inc.',
  'price': 97.25,
  'change': 1.21,
  'marketCap': '778.09B',
  'sector': 'Consumer Defensive'},
 {'ticker': 'JNJ',
  'name': 'Johnson & Johnson',
  'price': 156.31,
  'change': 0.4,
  'marketCap': '376.09B',
  'sector': 'Healthcare'},
 {'ticker': 'DIS',
  'name': 'Walt Disney Company (The)',
  'price': 90.95,
  'change': -0.22,
  'marketCap': '164.82B',
  'sector': 'Communication Services'},
 {'ticker': 'PFE',
  'name': 'Pfizer, Inc.',
  'price': 24.41,
  'change': 0.62,
  'marketCap': '138.44B',
  'sector': 'Healthcare'}];

// Precompute sectors for better performance
const sectors = ["All", ...new Set(marketStocksData.map(stock => stock.sector))];

const Market = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedPortfolio, setSelectedPortfolio] = useState(portfolioData[0].portfolio_id);
  
  // Filter stocks based on search and sector using useMemo
  const filteredStocks = useMemo(() => {
    let result = [...marketStocksData];
    
    // Apply search filter
    if (searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        stock => 
          stock.ticker.toLowerCase().includes(lowercaseSearchTerm) ||
          stock.name.toLowerCase().includes(lowercaseSearchTerm)
      );
    }
    
    // Apply sector filter
    if (selectedSector !== "All") {
      result = result.filter(
        stock => stock.sector === selectedSector
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [searchTerm, selectedSector, sortConfig]);

  // Handle sorting - memoized to prevent recreating on each render
  const requestSort = useCallback((key) => {
    setSortConfig(prevConfig => {
      let direction = "ascending";
      if (prevConfig.key === key && prevConfig.direction === "ascending") {
        direction = "descending";
      }
      return { key, direction };
    });
  }, []);
  
  // Open add stock modal - memoized
  const handleAddClick = useCallback((stock) => {
    setSelectedStock(stock);
    setQuantity(1);
    setIsAddModalOpen(true);
  }, []);
  
  // Handle adding stock to portfolio - memoized
  const handleAddStock = useCallback(() => {
    if (!selectedStock) return;
    
    // This would connect to your backend API
    console.log(`Adding ${quantity} shares of ${selectedStock.ticker} to portfolio ${selectedPortfolio}`);
    
    // Close modal first to improve perceived performance
    setIsAddModalOpen(false);
    
    // Show success message with a slight delay to ensure UI updates first
    setTimeout(() => {
      toast.success(`Added ${quantity} shares of ${selectedStock.ticker} to your portfolio`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }, 100);
    
  }, [quantity, selectedStock, selectedPortfolio]);

  // Memoize the search input handler to debounce frequent updates
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Memoize the sector select handler
  const handleSectorChange = useCallback((e) => {
    setSelectedSector(e.target.value);
  }, []);

  // Memoize quantity handlers
  const decreaseQuantity = useCallback(() => {
    setQuantity(prev => Math.max(1, prev - 1));
  }, []);

  const increaseQuantity = useCallback(() => {
    setQuantity(prev => prev + 1);
  }, []);

  const handleQuantityChange = useCallback((e) => {
    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
  }, []);

  const handlePortfolioChange = useCallback((e) => {
    setSelectedPortfolio(Number(e.target.value));
  }, []);

  const closeModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);
  
  return (
    <div className="market-container">
      <ToastContainer />
      
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
            onChange={handleSearchChange}
            className="market-search"
          />
        </div>
        
        <div className="sector-filter">
          <label htmlFor="sector-select">Sector:</label>
          <select
            id="sector-select"
            value={selectedSector}
            onChange={handleSectorChange}
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
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  No stocks match your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add Stock Modal - Only render when open for better performance */}
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
                  onChange={handlePortfolioChange}
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
                    onClick={decreaseQuantity}
                  >
                    -
                  </button>
                  <input
                    id="quantity-input"
                    type="number"
                    min="1"
                    value={quantity}
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
                onClick={closeModal}
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