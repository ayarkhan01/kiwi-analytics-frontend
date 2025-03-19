import { useState } from 'react';
import './market.css';

const Market = () => {
    const [stocks, setStocks] = useState([
        { ticker: 'AAPL', price: 212.0, quantity: '', selected: false },
        { ticker: 'GOOGL', price: 160.0, quantity: '', selected: false },
        { ticker: 'AMZN', price: 192.0, quantity: '', selected: false },
        { ticker: 'MSFT', price: 383.0, quantity: '', selected: false },
        { ticker: 'TSLA', price: 225.0, quantity: '', selected: false },
        { ticker: 'META', price: 582.0, quantity: '', selected: false },
        { ticker: 'NVDA', price: 115.0, quantity: '', selected: false },
        { ticker: 'JPM', price: 234.0, quantity: '', selected: false },
        { ticker: 'V', price: 334.0, quantity: '', selected: false },
        { ticker: 'JNJ', price: 164.0, quantity: '', selected: false },
    ]);

    const handleInputChange = (index, event) => {
        const newStocks = [...stocks];
        newStocks[index][event.target.name] = event.target.value;
        setStocks(newStocks);
    };

    const handleCheckboxChange = (index) => {
        const newStocks = [...stocks];
        newStocks[index].selected = !newStocks[index].selected;
        setStocks(newStocks);
    };

    const handleSubmit = () => {
        const selectedStocks = stocks.filter(stock => stock.selected && stock.quantity);
        console.log('Submitting purchase order for:', selectedStocks);
        // Implement API request or state management for submission
    };

    const handleClear = () => {
        const resetStocks = stocks.map(stock => ({ ...stock, quantity: '', selected: false }));
        setStocks(resetStocks);
    };

    return (
        <div className="market-container">
            <h1>The Market</h1>
            <table className="market-table">
                <thead>
                    <tr>
                        <th>Stock Ticker</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Select</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock, index) => (
                        <tr key={stock.ticker}>
                            <td>{stock.ticker}</td>
                            <td>{stock.price}</td>
                            <td>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={stock.quantity}
                                    onChange={(event) => handleInputChange(index, event)}
                                    disabled={!stock.selected}
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={stock.selected}
                                    onChange={() => handleCheckboxChange(index)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="market-actions">
                <button onClick={handleSubmit}>Submit Purchase Order</button>
                <button onClick={handleClear}>Clear</button>
            </div>
        </div>
    );
};

export default Market;
