import React, { useState, useEffect } from "react";
import { transactionsData } from "./transactions_data";
import "./transactions.css";

// Transactions Component
const Transactions = () => {
  // UI states
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedPortfolios, setSelectedPortfolios] = useState([]);
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortDirection, setSortDirection] = useState("desc");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [liveTransactions, setLiveTransactions] = useState([]);

  // Form input states
  const [newPortfolio, setNewPortfolio] = useState("");
  const [newTicker, setNewTicker] = useState("");
  const [newType, setNewType] = useState("Buy");
  const [newQuantity, setNewQuantity] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDateTime, setNewDateTime] = useState("");

  // Get unique portfolio names
  const uniquePortfolios = [
    ...new Set([...transactionsData, ...liveTransactions].map((t) => t.portfolio)),
  ];

  // Get unique tickers
  const uniqueTickers = [
    ...new Set([...transactionsData, ...liveTransactions].map((t) => t.ticker)),
  ];

  const transactionTypes = ["Buy", "Sell"];

  // Combine live and static transactions
  const combinedTransactions = [...transactionsData, ...liveTransactions];

  // Fetch live transactions from API
  const fetchLiveTransactions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/transactions");
      if (!response.ok) {
        console.error("Failed to fetch live transactions:", response.statusText);
        return;
      }
      const data = await response.json();
      setLiveTransactions(data);
    } catch (error) {
      console.error("Error fetching live transactions:", error);
    }
  };

  // Fetch live transactions on load
  useEffect(() => {
    fetchLiveTransactions();
  }, []);

  // Filtering and sorting
  useEffect(() => {
    let result = [...combinedTransactions];

    if (selectedPortfolios.length > 0) {
      result = result.filter((t) => selectedPortfolios.includes(t.portfolio));
    }

    if (selectedTickers.length > 0) {
      result = result.filter((t) => selectedTickers.includes(t.ticker));
    }

    if (selectedTypes.length > 0) {
      result = result.filter((t) => selectedTypes.includes(t.type));
    }

    result.sort((a, b) => {
      const dateA = new Date(a.dateTime);
      const dateB = new Date(b.dateTime);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredTransactions(result);
  }, [
    selectedPortfolios,
    selectedTickers,
    selectedTypes,
    sortDirection,
    combinedTransactions,
  ]);

  // Toggle portfolio filter
  const togglePortfolioFilter = (portfolio) => {
    setSelectedPortfolios((prev) =>
      prev.includes(portfolio)
        ? prev.filter((p) => p !== portfolio)
        : [...prev, portfolio]
    );
  };

  // Toggle ticker filter
  const toggleTickerFilter = (ticker) => {
    setSelectedTickers((prev) =>
      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
    );
  };

  // Toggle transaction type filter
  const toggleTypeFilter = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Toggle sort order
  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  // Toggle filter visibility
  const toggleFiltersVisibility = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedPortfolios([]);
    setSelectedTickers([]);
    setSelectedTypes([]);
    setSortDirection("desc");
  };

  // Format date-time to readable string
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  const activeFiltersCount =
    selectedPortfolios.length + selectedTickers.length + selectedTypes.length;

  // Add transaction handler
  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (!newPortfolio || !newTicker || !newQuantity || !newPrice || !newDateTime) {
      alert("Please fill in all fields.");
      return;
    }

    const newTxn = {
      portfolio: newPortfolio,
      ticker: newTicker,
      type: newType,
      quantity: parseInt(newQuantity, 10),
      price: parseFloat(newPrice),
      dateTime: newDateTime,
    };

    try {
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTxn),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error adding transaction: ${errorData.error || response.statusText}`);
        return;
      }

      await response.json();

      setNewPortfolio("");
      setNewTicker("");
      setNewType("Buy");
      setNewQuantity("");
      setNewPrice("");
      setNewDateTime("");

      fetchLiveTransactions();
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Error adding transaction");
    }
  };

  // JSX return block
  return (
    <div className="transactions-container">
      {/* Header */}
      <div className="transactions-header">
        <h1>TRANSACTIONS</h1>
        <div className="transactions-subheader">
          <h2>All Transactions History</h2>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="filter-toggle-container">
        <button className="filter-toggle-btn" onClick={toggleFiltersVisibility}>
          {isFiltersVisible ? "Hide Filters" : "Show Filters"}
          {activeFiltersCount > 0 && <span className="filter-badge">{activeFiltersCount}</span>}
        </button>

        {activeFiltersCount > 0 && (
          <button className="reset-filters-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        )}

        <div className="sort-control">
          <button className="sort-btn" onClick={toggleSortDirection}>
            {sortDirection === "desc" ? "Newest First ▼" : "Oldest First ▲"}
          </button>
        </div>
      </div>

      {/* Filters */}
      {isFiltersVisible && (
        <div className="filter-controls">
          {/* Portfolio Filter */}
          <div className="filter-section">
            <div className="filter-label">Portfolios:</div>
            <div className="filter-options">
              {uniquePortfolios.map((portfolio) => (
                <button
                  key={portfolio}
                  className={`filter-btn ${
                    selectedPortfolios.includes(portfolio) ? "active" : ""
                  }`}
                  onClick={() => togglePortfolioFilter(portfolio)}
                >
                  {portfolio}
                </button>
              ))}
            </div>
          </div>

          {/* Ticker Filter */}
          <div className="filter-section">
            <div className="filter-label">Stocks:</div>
            <div className="filter-options">
              {uniqueTickers.map((ticker) => (
                <button
                  key={ticker}
                  className={`filter-btn ${
                    selectedTickers.includes(ticker) ? "active" : ""
                  }`}
                  onClick={() => toggleTickerFilter(ticker)}
                >
                  {ticker}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="filter-section">
            <div className="filter-label">Type:</div>
            <div className="filter-options">
              {transactionTypes.map((type) => (
                <button
                  key={type}
                  className={`filter-btn ${
                    selectedTypes.includes(type) ? "active" : ""
                  }`}
                  onClick={() => toggleTypeFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="transactions-list">
        {filteredTransactions.map((txn, index) => (
          <div key={index} className="transaction-item">
            <div><strong>Portfolio:</strong> {txn.portfolio}</div>
            <div><strong>Ticker:</strong> {txn.ticker}</div>
            <div><strong>Type:</strong> {txn.type}</div>
            <div><strong>Quantity:</strong> {txn.quantity}</div>
            <div><strong>Price:</strong> ${txn.price.toFixed(2)}</div>
            <div><strong>Date:</strong> {formatDateTime(txn.dateTime)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
