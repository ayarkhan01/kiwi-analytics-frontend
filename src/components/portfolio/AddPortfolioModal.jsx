// AddPortfolioModal.jsx
import React, { useState } from "react";
import "./portfolio.css";

const AddPortfolioModal = ({ isOpen, onClose, onAddPortfolio }) => {
  const [portfolioName, setPortfolioName] = useState("");
  const [strategy, setStrategy] = useState("long_term");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Call the onAddPortfolio function with form data
    onAddPortfolio({
      name: portfolioName,
      strategy: strategy
    });
    
    // Reset form
    setPortfolioName("");
    setStrategy("long_term");
    
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
              onChange={(e) => setPortfolioName(e.target.value)}
              required
              placeholder="e.g. Growth Investments"
            />
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