import React, { useState, useMemo, useEffect, useCallback } from "react";
import "./Market.css";
// Remove this import, we will fetch real portfolios
// import { portfolioData } from "../portfolio/portfolio_data";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Market = ({ userId, balance, setUser }) => {

  // State management
  const [marketStocks, setMarketStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // User portfolios state
  const [userPortfolios, setUserPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  // Fetch user portfolios from API
  useEffect(() => {
    const fetchPortfolios = async () => {
      if (!userId) return;
      try {
        // Use port 5001 to match Portfolio.jsx
        const response = await fetch('http://127.0.0.1:5001/api/portfolios/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId }),
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        setUserPortfolios(data);
        if (data.length > 0) {
          setSelectedPortfolio(String(data[0].portfolio_id));
        }
      } catch (err) {
        setUserPortfolios([]);
        setSelectedPortfolio("");
      }
    };
    fetchPortfolios();
  }, [userId]);

  // Fetch market data from backend API
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://127.0.0.1:5001/api/market');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        setMarketStocks(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch market data:", err);
        setError("Failed to load market data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketData();
  }, []);
  
  // Compute available sectors from the fetched data
  const sectors = useMemo(() => {
    if (!marketStocks.length) return ["All"];
    return ["All", ...new Set(marketStocks.map(stock => stock.sector))];
  }, [marketStocks]);
  
  // Filter stocks based on search and sector using useMemo
  const filteredStocks = useMemo(() => {
    if (!marketStocks.length) return [];
    
    let result = [...marketStocks];
    
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
  }, [marketStocks, searchTerm, selectedSector, sortConfig]);

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
  const handleAddStock = async () => {
    if (!selectedStock || !selectedPortfolio || !quantity) {
      toast.error('Please select a stock, portfolio, and quantity');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5001/api/portfolios/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          portfolio_id: selectedPortfolio,
          ticker: selectedStock.ticker,
          quantity: quantity,
          price: selectedStock.price
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add stock to portfolio');
      }

      // After successful transaction, fetch updated balance
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

      toast.success('Stock added successfully!');
      setIsAddModalOpen(false);
      setQuantity(1);
    } catch (error) {
      console.error('Error adding stock:', error);
      toast.error(error.message || 'Failed to add stock');
    }
  };

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
  
  // Update selectedPortfolio when userPortfolios change (e.g. after fetch)
  useEffect(() => {
    if (userPortfolios.length > 0 && !selectedPortfolio) {
      setSelectedPortfolio(userPortfolios[0].portfolio_id);
    }
  }, [userPortfolios, selectedPortfolio]);
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="market-container">
        <div className="market-header">
          <h1>Market</h1>
          <p className="market-subheader">Loading market data...</p>
        </div>
        <div className="loading-indicator">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="market-container">
        <div className="market-header">
          <h1>Market</h1>
          <p className="market-subheader">Error loading market data</p>
        </div>
        <div className="error-message">
          {error}
          <button className="retry-button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="market-container">
      <ToastContainer />
      
      <div className="market-header">
  <div className="market-title-group">
    <div>
      <h1>Market</h1>
      <p className="market-subheader">Browse and add stocks to your portfolios</p>
    </div>
    <div className="market-balance">
      <span className="balance-label">Account Balance:</span>
      <span className="balance-value">${balance?.toFixed(2)}</span>
    </div>
  </div>
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
                  value={selectedPortfolio || ""}
                  onChange={e => setSelectedPortfolio(e.target.value)}
                  className="portfolio-select"
                >
                  {userPortfolios.length === 0 ? (
                    <option disabled value="">No portfolios found</option>
                  ) : (
                    userPortfolios.map(portfolio => (
                      <option key={portfolio.portfolio_id} value={String(portfolio.portfolio_id)}>
                        {portfolio.portfolio_name}
                      </option>
                    ))
                  )}
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