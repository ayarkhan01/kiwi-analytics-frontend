import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/login/Login.jsx";
import About from "./components/about/About.jsx";
import Portfolio from "./components/portfolio/Portfolio.jsx";
import Market from "./components/market/Market.jsx";
import Navbar from "./components/NavBar/Navbar.jsx";
import Transactions from "./components/transactions/Transactions.jsx";
import Settings from "./components/settings/Settings.jsx";
import "./index.css";

function App() {
  const [user, setUser] = useState({
    user: "",
    userID: "",
    isLoggedIn: false,
    balance: null,
  });

  const handleLogout = () => {
    setUser({ user: "", userID: "", isLoggedIn: false, balance: null });
  };

  // 🔄 Fetch balance whenever user logs in
  useEffect(() => {
    const fetchBalance = async () => {
      if (user.isLoggedIn && user.userID) {
        try {
          const response = await fetch("http://127.0.0.1:5001/api/user/balance", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user.userID }),
          });

          const data = await response.json();
          if (response.ok) {
            setUser((prevUser) => ({
              ...prevUser,
              balance: data.balance,
            }));
          } else {
            console.error("Balance fetch error:", data.error);
          }
        } catch (error) {
          console.error("Balance fetch failed:", error);
        }
      }
    };

    fetchBalance();
  }, [user.isLoggedIn, user.userID]);

  return (
    <Router>
      {user.isLoggedIn && <Navbar handleLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={
            user.isLoggedIn ? <Navigate to="/portfolio" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={
            !user.isLoggedIn ? (
              <Login setUserInParentComponent={setUser} />
            ) : (
              <Navigate to="/portfolio" />
            )
          }
        />
        <Route
          path="/portfolio"
          element={user.isLoggedIn ? <Portfolio userId={user.userID} balance={user.balance} setUser={setUser} /> : <Navigate to="/login" />}
        />
        <Route
          path="/market"
          element={user.isLoggedIn ? <Market userId={user.userID} balance={user.balance} setUser={setUser} /> : <Navigate to="/login" />}
        />
        <Route
          path="/transactions"
          element={user.isLoggedIn ? <Transactions userId={user.userID}/> : <Navigate to="/login" />}
        />
        <Route
          path="/about"
          element={user.isLoggedIn ? <About /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={
            user.isLoggedIn ? (
              <Settings user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
