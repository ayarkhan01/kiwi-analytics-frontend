// portfolio_data.js
// Sample data based on your JSON
export const portfolioData = [
    {
      portfolio_id: 1,
      portfolio_name: "Retirement Portfolio",
      strategy: "long_term",
      positions: [
        {
          id: 1,
          ticker: "AAPL",
          quantity: 5,
          average_price: 150.0,
          created_at: "2025-04-15T18:34:24",
          updated_at: "2025-04-22T00:28:24",
          current_price: 188.38,
          percent_change: -7.29 // This is the daily price change %
        },
        {
          id: 4,
          ticker: "MSFT",
          quantity: 10,
          average_price: 100.0,
          created_at: "2025-04-22T00:22:51",
          updated_at: "2025-04-22T00:22:51",
          current_price: 359.84,
          percent_change: -3.56
        },
        {
          id: 2,
          ticker: "GOOGL",
          quantity: 5,
          average_price: 2800.0,
          created_at: "2025-04-15T18:34:24",
          updated_at: "2025-04-15T18:34:24",
          current_price: 147.74,
          percent_change: -3.20
        },
        {
          id: 6,
          ticker: "AMZN",
          quantity: 8,
          average_price: 120.0,
          created_at: "2025-04-22T00:31:22",
          updated_at: "2025-04-22T00:31:22", 
          current_price: 178.14,
          percent_change: -4.15
        },
        {
          id: 7,
          ticker: "META",
          quantity: 12,
          average_price: 300.0,
          created_at: "2025-04-22T00:31:22",
          updated_at: "2025-04-22T00:31:22",
          current_price: 518.00,
          percent_change: -5.06
        }
      ]
    },
    {
      portfolio_id: 2,
      portfolio_name: "Swing Trades",
      strategy: "short_term",
      positions: [
        {
          id: 3,
          ticker: "TSLA",
          quantity: 3,
          average_price: 700.0,
          created_at: "2025-04-15T18:34:24",
          updated_at: "2025-04-15T18:34:24",
          current_price: 292.03,
          percent_change: 2.15
        }
      ]
    }
  ];
  
  // Company name mapping
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