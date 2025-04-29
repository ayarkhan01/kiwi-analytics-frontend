import React, { useState } from "react";
import "./transactions.css";

const Transactions = () => {
  // Sample transaction data matching backend format
  const sampleData = [
    {
      id: 1,
      portfolio: 'Retirement Portfolio',
      ticker: 'AAPL',
      type: 'Buy',
      quantity: 10,
      price: 150.0,
      dateTime: '2025-04-15 18:34:45'
    },
    {
      id: 2,
      portfolio: 'Retirement Portfolio',
      ticker: 'GOOGL',
      type: 'Buy',
      quantity: 5,
      price: 2800.0,
      dateTime: '2025-04-15 18:34:45'
    },
    {
      id: 3,
      portfolio: 'Swing Trades',
      ticker: 'TSLA',
      type: 'Buy',
      quantity: 3,
      price: 700.0,
      dateTime: '2025-04-15 18:34:45'
    },
    {
      id: 4,
      portfolio: 'Swing Trades',
      ticker: 'TSLA',
      type: 'Sell',
      quantity: 1,
      price: 750.0,
      dateTime: '2025-04-15 18:34:45'
    }
  ];

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter data based on search term
  const filteredData = sampleData.filter(transaction => {
    if (searchTerm === "") return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    // Search across all columns
    return (
      transaction.portfolio.toLowerCase().includes(searchLower) ||
      transaction.ticker.toLowerCase().includes(searchLower) ||
      transaction.type.toLowerCase().includes(searchLower) ||
      transaction.quantity.toString().includes(searchLower) ||
      transaction.price.toString().includes(searchLower) ||
      transaction.dateTime.toLowerCase().includes(searchLower)
    );
  });
  
  // Calculate pagination
  const totalTransactions = filteredData.length;
  const totalPages = Math.ceil(totalTransactions / rowsPerPage);
  
  // Get current page data
  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = filteredData.slice(indexOfFirstTransaction, indexOfLastTransaction);
  
  // Page change handlers
  const goToNextPage = () => {
    setCurrentPage(currentPage + 1 <= totalPages ? currentPage + 1 : currentPage);
  };
  
  const goToPreviousPage = () => {
    setCurrentPage(currentPage - 1 >= 1 ? currentPage - 1 : currentPage);
  };
  
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h1>TRANSACTIONS</h1>
        <div className="transactions-subheader">
          <h2>All Transactions History</h2>
        </div>
      </div>
      
      <div className="transactions-controls">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="results-control">
          <span>Show Results</span>
          <div className="dropdown">
            <button className="dropdown-toggle">
              {rowsPerPage} <span className="caret">▼</span>
            </button>
          </div>
        </div>
      </div>
      
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
            {currentTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.portfolio}</td>
                <td>{transaction.ticker}</td>
                <td className={transaction.type === "Buy" ? "buy-type" : "sell-type"}>
                  {transaction.type}
                </td>
                <td>{transaction.quantity}</td>
                <td>${transaction.price.toFixed(2)}</td>
                <td>{transaction.dateTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pagination-container">
        <div className="showing-info">
          Showing {currentTransactions.length} of {totalTransactions}
        </div>
        <div className="pagination-controls">
          <button 
            className="page-btn prev-btn" 
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`page-num-btn ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => goToPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          
          <button 
            className="page-btn next-btn" 
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;