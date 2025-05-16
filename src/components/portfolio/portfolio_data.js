// portfolio_data.js
export const portfolioData = [
  {
    "portfolio_id": 1,
    "portfolio_name": "Retirement Portfolio",
    "strategy": "long_term",
    "positions": [
      {
        "id": 1,
        "ticker": "AAPL",
        "name": "Apple Inc.",
        "sector": "Technology",
        "quantity": 84,
        "average_price": 160.72,
        "created_at": "2025-04-15T18:34:24",
        "updated_at": "2025-04-30T03:11:42",
        "current_price": 212.5,
        "market_value": 17850.0,
        "cost_basis": 13500.48,
        "profit_loss": 4349.52,
        "profit_loss_percent": 32.22,
        "percent_change": 1.29,
        "market_cap": "3.19T"
      },
      {
        "id": 2,
        "ticker": "GOOGL",
        "name": "Alphabet Inc.",
        "sector": "Communication Services",
        "quantity": 5,
        "average_price": 2800.0,
        "created_at": "2025-04-15T18:34:24",
        "updated_at": "2025-04-15T18:34:24",
        "current_price": 158.8,
        "market_value": 794.0,
        "cost_basis": 14000.0,
        "profit_loss": -13206.0,
        "profit_loss_percent": -94.33,
        "percent_change": -1.36,
        "market_cap": "1.95T"
      },
      {
        "id": 7,
        "ticker": "META",
        "name": "Meta Platforms, Inc.",
        "sector": "Communication Services",
        "quantity": 11,
        "average_price": 175.0,
        "created_at": "2025-04-30T03:15:06",
        "updated_at": "2025-04-30T03:22:39",
        "current_price": 549.0,
        "market_value": 6039.0,
        "cost_basis": 1925.0,
        "profit_loss": 4114.0,
        "profit_loss_percent": 213.71,
        "percent_change": -5.44,
        "market_cap": "1.4T"
      },
      {
        "id": 4,
        "ticker": "MSFT",
        "name": "Microsoft Corporation",
        "sector": "Technology",
        "quantity": 10,
        "average_price": 100.0,
        "created_at": "2025-04-22T00:22:51",
        "updated_at": "2025-04-22T00:22:51",
        "current_price": 395.26,
        "market_value": 3952.6,
        "cost_basis": 1000.0,
        "profit_loss": 2952.6,
        "profit_loss_percent": 295.26,
        "percent_change": 1.22,
        "market_cap": "2.94T"
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
        "name": "Meta Platforms, Inc.",
        "sector": "Communication Services",
        "quantity": 113,
        "average_price": 75.0,
        "created_at": "2025-04-30T03:14:14",
        "updated_at": "2025-04-30T03:14:14",
        "current_price": 549.0,
        "market_value": 62037.0,
        "cost_basis": 8475.0,
        "profit_loss": 53562.0,
        "profit_loss_percent": 632.0,
        "percent_change": -5.44,
        "market_cap": "1.4T"
      },
      {
        "id": 3,
        "ticker": "TSLA",
        "name": "Tesla, Inc.",
        "sector": "Consumer Cyclical",
        "quantity": 3,
        "average_price": 700.0,
        "created_at": "2025-04-15T18:34:24",
        "updated_at": "2025-04-15T18:34:24",
        "current_price": 282.16,
        "market_value": 846.48,
        "cost_basis": 2100.0,
        "profit_loss": -1253.52,
        "profit_loss_percent": -59.69,
        "percent_change": -9.87,
        "market_cap": "940.62B"
      }
    ]
  }
];

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
    return total + position.market_value;
  }, 0);
};

// Calculate portfolio total cost basis
export const calculatePortfolioCost = (portfolio) => {
  return portfolio.positions.reduce((total, position) => {
    return total + position.cost_basis;
  }, 0);
};

// Calculate portfolio total profit/loss
export const calculatePortfolioProfitLoss = (portfolio) => {
  return portfolio.positions.reduce((total, position) => {
    return total + position.profit_loss;
  }, 0);
};

// Calculate portfolio profit/loss percentage
export const calculatePortfolioProfitLossPercentage = (portfolio) => {
  const totalCost = calculatePortfolioCost(portfolio);
  const profitLoss = calculatePortfolioProfitLoss(portfolio);
  return (profitLoss / totalCost) * 100;
};