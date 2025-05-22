import React, { useState, useEffect } from "react";
import "./transactions.css";

const Transactions = ({ userId }) => {
  // State for filters and sorting
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedPortfolios, setSelectedPortfolios] = useState([]);
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortDirection, setSortDirection] = useState('desc'); // 'desc' = newest first, 'asc' = oldest first
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5001/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Transform the data to match the frontend's expected format
        const transformedData = data.map(transaction => ({
          portfolio: transaction.portfolio_name,
          ticker: transaction.ticker,
          type: transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1), // Capitalize first letter
          quantity: transaction.quantity,
          price: transaction.price,
          dateTime: transaction.executed_at,
          id: transaction.id
        }));
        setTransactions(transformedData);
        setFilteredTransactions(transformedData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchTransactions();
    }
  }, [userId]);
  
  // Get unique portfolios, tickers, and transaction types
  const uniquePortfolios = [...new Set(transactions.map(t => t.portfolio))];
  const uniqueTickers = [...new Set(transactions.map(t => t.ticker))];
  const transactionTypes = ["Buy", "Sell"];
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...transactions];
    
    // Apply portfolio filter if any selected
    if (selectedPortfolios.length > 0) {
      result = result.filter(t => selectedPortfolios.includes(t.portfolio));
    }
    
    // Apply ticker filter if any selected
    if (selectedTickers.length > 0) {
      result = result.filter(t => selectedTickers.includes(t.ticker));
    }
    
    // Apply transaction type filter if any selected
    if (selectedTypes.length > 0) {
      result = result.filter(t => selectedTypes.includes(t.type));
    }
    
    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.dateTime);
      const dateB = new Date(b.dateTime);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredTransactions(result);
  }, [selectedPortfolios, selectedTickers, selectedTypes, sortDirection, transactions]);
  
  // Toggle filter selection
  const togglePortfolioFilter = (portfolio) => {
    setSelectedPortfolios(prev => 
      prev.includes(portfolio) 
        ? prev.filter(p => p !== portfolio) 
        : [...prev, portfolio]
    );
  };
  
  const toggleTickerFilter = (ticker) => {
    setSelectedTickers(prev => 
      prev.includes(ticker) 
        ? prev.filter(t => t !== ticker) 
        : [...prev, ticker]
    );
  };
  
  const toggleTypeFilter = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };
  
  // Toggle filters visibility
  const toggleFiltersVisibility = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedPortfolios([]);
    setSelectedTickers([]);
    setSelectedTypes([]);
    setSortDirection('desc');
  };
  
  // Format date for display
  const formatDateTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) {
        return dateTimeStr; // Return original string if date is invalid
      }
      return date.toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateTimeStr; // Return original string if there's an error
    }
  };

  // Count active filters
  const activeFiltersCount = selectedPortfolios.length + selectedTickers.length + selectedTypes.length;

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h1>TRANSACTIONS</h1>
        <div className="transactions-subheader">
          <h2>All Transactions History</h2>
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading">Loading transactions...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          {/* Filter toggle button */}
          <div className="filter-toggle-container">
            <button 
              className="filter-toggle-btn" 
              onClick={toggleFiltersVisibility}
            >
              {isFiltersVisible ? 'Hide Filters' : 'Show Filters'} 
              {activeFiltersCount > 0 && (
                <span className="filter-badge">{activeFiltersCount}</span>
              )}
            </button>
            
            {activeFiltersCount > 0 && (
              <button 
                className="reset-filters-btn" 
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            )}
            
            <div className="sort-control">
              <button className="sort-btn" onClick={toggleSortDirection}>
                {sortDirection === 'desc' ? 'Newest First ▼' : 'Oldest First ▲'}
              </button>
            </div>
          </div>
          
          {/* Collapsible filters */}
          {isFiltersVisible && (
            <div className="filter-controls">
              <div className="filter-section">
                <div className="filter-label">Portfolios:</div>
                <div className="filter-options">
                  {uniquePortfolios.map(portfolio => (
                    <button 
                      key={portfolio}
                      className={`filter-btn ${selectedPortfolios.includes(portfolio) ? 'active' : ''}`}
                      onClick={() => togglePortfolioFilter(portfolio)}
                    >
                      {portfolio}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="filter-section">
                <div className="filter-label">Stocks:</div>
                <div className="filter-options">
                  {uniqueTickers.map(ticker => (
                    <button 
                      key={ticker}
                      className={`filter-btn ${selectedTickers.includes(ticker) ? 'active' : ''}`}
                      onClick={() => toggleTickerFilter(ticker)}
                    >
                      {ticker}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="filter-section">
                <div className="filter-label">Type:</div>
                <div className="filter-options">
                  {transactionTypes.map(type => (
                    <button 
                      key={type}
                      className={`filter-btn ${selectedTypes.includes(type) ? 'active' : ''}`}
                      onClick={() => toggleTypeFilter(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="transactions-table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>PORTFOLIO</th>
                  <th>TICKER</th>
                  <th>TYPE</th>
                  <th>QUANTITY</th>
                  <th>PRICE</th>
                  <th>DATE & TIME</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.portfolio}</td>
                    <td>{transaction.ticker}</td>
                    <td className={transaction.type.toLowerCase() === "buy" ? "buy-type" : "sell-type"}>
                      {transaction.type}
                    </td>
                    <td>{transaction.quantity}</td>
                    <td>${transaction.price.toFixed(2)}</td>
                    <td>{formatDateTime(transaction.dateTime)}</td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="no-results">No transactions match the selected filters</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="transactions-count">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
        </>
      )}
    </div>
  );
};

export default Transactions;