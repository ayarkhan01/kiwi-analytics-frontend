
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