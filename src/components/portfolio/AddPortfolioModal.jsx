// AddPortfolioModal.jsx
import React, { useState } from "react";
import "./portfolio.css";

const AddPortfolioModal = ({ isOpen, onClose, onAddPortfolio }) => {
  const [portfolioName, setPortfolioName] = useState("");
  const [strategy, setStrategy] = useState("long_term");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!portfolioName.trim()) {
      setError("Portfolio name cannot be empty");
      return;
    }
    
    // Call the onAddPortfolio function with form data
    onAddPortfolio({
      name: portfolioName.trim(),
      strategy: strategy
    });
    
    // Reset form
    setPortfolioName("");
    setStrategy("long_term");
    setError("");
    
    // Close modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Portfolio</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="portfolioName">Portfolio Name</label>
            <input
              type="text"
              id="portfolioName"
              value={portfolioName}
              onChange={(e) => {
                setPortfolioName(e.target.value);
                setError("");
              }}
              required
              placeholder="e.g. Growth Investments"
            />
            {error && <div className="error-message" style={{color: 'red', fontSize: '0.8rem', marginTop: '5px'}}>{error}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="strategy">Investment Strategy</label>
            <select
              id="strategy"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
            >
              <option value="long_term">Long Term</option>
              <option value="short_term">Short Term</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Create Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPortfolioModal;