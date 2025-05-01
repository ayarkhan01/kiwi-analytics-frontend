// portfolio_data.js
// Sample data based on your JSON
export const portfolioData = [
  {
    "portfolio_id": 1,
    "portfolio_name": "Retirement Portfolio",
    "strategy": "long_term",
    "positions": [
      {
        "id": 1,
        "ticker": "AAPL",
        "quantity": 84,
        "average_price": 160.72,
        "created_at": "2025-04-15T18:34:24",
        "updated_at": "2025-04-30T03:11:42",
        "current_price": 211.21,
        "percent_change": 0.51
      },
      {
        "id": 2,
        "ticker": "GOOGL",
        "quantity": 5,
        "average_price": 2800.0,
        "created_at": "2025-04-15T18:34:24",
        "updated_at": "2025-04-15T18:34:24",
        "current_price": 160.16,
        "percent_change": -0.28
      },
      {
        "id": 7,
        "ticker": "META",
        "quantity": 11,
        "average_price": 175.0,
        "created_at": "2025-04-30T03:15:06",
        "updated_at": "2025-04-30T03:15:06",
        "current_price": 554.44,
        "percent_change": 0.85
      },
      {
        "id": 4,
        "ticker": "MSFT",
        "quantity": 10,
        "average_price": 100.0,
        "created_at": "2025-04-22T00:22:51",
        "updated_at": "2025-04-22T00:22:51",
        "current_price": 394.04,
        "percent_change": 0.74
      }
    ]
  },
  {
    "portfolio_id": 2,
    "portfolio_name": "Swing Trades",
    "strategy": "short_term",
    "positions": [
      {
        "id": 6,
        "ticker": "META",
        "quantity": 113,
        "average_price": 75.0,
        "created_at": "2025-04-30T03:14:14",
        "updated_at": "2025-04-30T03:14:14",
        "current_price": 554.44,
        "percent_change": 0.85
      },
      {
        "id": 3,
        "ticker": "TSLA",
        "quantity": 3,
        "average_price": 700.0,
        "created_at": "2025-04-15T18:34:24",
        "updated_at": "2025-04-15T18:34:24",
        "current_price": 292.03,
        "percent_change": 2.15
      }
    ]
  }
];
export const companyNames = {
  "AAPL": "Apple Inc.",
  "MSFT": "Microsoft Corp.",
  "GOOGL": "Alphabet Inc.",
  "AMZN": "Amazon.com Inc.",
  "META": "Meta Platforms Inc.",
  "TSLA": "Tesla Inc."
};

  
  // Format currency 
  export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format percentage
  export const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  // Format strategy name for display
  export const formatStrategy = (strategy) => {
    if (strategy === "long_term") return "Long Term";
    if (strategy === "short_term") return "Short Term";
    return strategy.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  // Calculate portfolio total market value
  export const calculatePortfolioTotal = (portfolio) => {
    return portfolio.positions.reduce((total, position) => {
      return total + (position.quantity * position.current_price);
    }, 0);
  };
  
  // Calculate portfolio total cost basis
  export const calculatePortfolioCost = (portfolio) => {
    return portfolio.positions.reduce((total, position) => {
      return total + (position.quantity * position.average_price);
    }, 0);
  };
  
  // Calculate portfolio total profit/loss
  export const calculatePortfolioProfitLoss = (portfolio) => {
    const totalValue = calculatePortfolioTotal(portfolio);
    const totalCost = calculatePortfolioCost(portfolio);
    return totalValue - totalCost;
  };
  
  // Calculate portfolio profit/loss percentage
  export const calculatePortfolioProfitLossPercentage = (portfolio) => {
    const totalValue = calculatePortfolioTotal(portfolio);
    const totalCost = calculatePortfolioCost(portfolio);
    return ((totalValue - totalCost) / totalCost) * 100;
  };
  
  // Calculate position details
  export const calculatePositionDetails = (position) => {
    // Calculate current market value
    const marketValue = position.quantity * position.current_price;
    
    // Calculate cost basis
    const costBasis = position.quantity * position.average_price;
    
    // Calculate profit/loss
    const profitLoss = marketValue - costBasis;
    
    // Calculate profit/loss percentage
    const profitLossPercentage = ((position.current_price - position.average_price) / position.average_price) * 100;
    
    return {
      marketValue,
      costBasis,
      profitLoss,
      profitLossPercentage
    };
  };