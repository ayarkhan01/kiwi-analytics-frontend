import { useState } from "react";
import "./market.css";

const Market = () => {
  const [stocks, setStocks] = useState([
    {
      ticker: "AAPL",
      price: 212.0,
      change: 3.25,
      changePercent: 1.56,
      quantity: "",
      selected: false,
    },
    {
      ticker: "GOOGL",
      price: 160.0,
      change: 2.15,
      changePercent: 1.36,
      quantity: "",
      selected: false,
    },
    {
      ticker: "AMZN",
      price: 192.0,
      change: -1.45,
      changePercent: -0.75,
      quantity: "",
      selected: false,
    },
    {
      ticker: "MSFT",
      price: 383.0,
      change: 5.2,
      changePercent: 1.38,
      quantity: "",
      selected: false,
    },
    {
      ticker: "TSLA",
      price: 225.0,
      change: -3.75,
      changePercent: -1.64,
      quantity: "",
      selected: false,
    },
    {
      ticker: "META",
      price: 582.0,
      change: 7.85,
      changePercent: 1.37,
      quantity: "",
      selected: false,
    },
    {
      ticker: "NVDA",
      price: 115.0,
      change: 2.3,
      changePercent: 2.04,
      quantity: "",
      selected: false,
    },
    {
      ticker: "JPM",
      price: 234.0,
      change: -1.25,
      changePercent: -0.53,
      quantity: "",
      selected: false,
    },
    {
      ticker: "V",
      price: 334.0,
      change: 4.45,
      changePercent: 1.35,
      quantity: "",
      selected: false,
    },
    {
      ticker: "JNJ",
      price: 164.0,
      change: 0.85,
      changePercent: 0.52,
      quantity: "",
      selected: false,
    },
  ]);

  const [orderSummary, setOrderSummary] = useState({
    show: false,
    stocks: [],
    totalValue: 0,
  });

  const handleInputChange = (index, event) => {
    const newStocks = [...stocks];
    newStocks[index][event.target.name] = event.target.value;
    setStocks(newStocks);
  };

  const handleCheckboxChange = (index) => {
    const newStocks = [...stocks];
    newStocks[index].selected = !newStocks[index].selected;

    // Reset quantity if unchecked
    if (!newStocks[index].selected) {
      newStocks[index].quantity = "";
    }

    setStocks(newStocks);
  };

  const handleSubmit = () => {
    const selectedStocks = stocks.filter(
      (stock) => stock.selected && stock.quantity
    );
    const total = selectedStocks.reduce(
      (sum, stock) => sum + stock.price * Number(stock.quantity),
      0
    );

    setOrderSummary({
      show: true,
      stocks: selectedStocks,
      totalValue: total,
    });
  };

  const handleClear = () => {
    const resetStocks = stocks.map((stock) => ({
      ...stock,
      quantity: "",
      selected: false,
    }));
    setStocks(resetStocks);
    setOrderSummary({ show: false, stocks: [], totalValue: 0 });
  };

  const handleConfirmOrder = () => {
    // Here you would typically send the order to an API
    alert("Order submitted successfully!");
    handleClear();
  };

  return (
    <div className="market-container">
      <h1 className="page-title">The Market</h1>

      <div className="market-table-container">
        <table className="market-table">
          <thead>
            <tr>
              <th>Stock Ticker</th>
              <th>Price</th>
              <th>Change</th>
              <th>Quantity</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr key={stock.ticker}>
                <td>{stock.ticker}</td>
                <td>${stock.price.toFixed(2)}</td>
                <td className={stock.change >= 0 ? "positive" : "negative"}>
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)}({stock.change >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%)
                </td>
                <td>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={stock.quantity}
                    onChange={(event) => handleInputChange(index, event)}
                    disabled={!stock.selected}
                  />
                </td>
                <td>
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={stock.selected}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orderSummary.show && (
        <div className="order-summary glass-card">
          <h2>Order Summary</h2>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderSummary.stocks.map((stock) => (
                <tr key={stock.ticker}>
                  <td>{stock.ticker}</td>
                  <td>${stock.price.toFixed(2)}</td>
                  <td>{stock.quantity}</td>
                  <td>${(stock.price * Number(stock.quantity)).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan="3">Total Order Value:</td>
                <td>${orderSummary.totalValue.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div className="market-actions">
            <button onClick={handleConfirmOrder}>Confirm Order</button>
            <button onClick={handleClear}>Cancel</button>
          </div>
        </div>
      )}

      {!orderSummary.show && (
        <div className="market-actions">
          <button onClick={handleSubmit}>Submit Purchase Order</button>
          <button onClick={handleClear}>Clear</button>
        </div>
      )}
    </div>
  );
};

export default Market;
