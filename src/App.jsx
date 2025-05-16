import { useState } from "react";
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
  });

  const handleLogout = () => {
    setUser({ user: "", userID:"",isLoggedIn: false });
  };

  return (
    <Router>
      {user.isLoggedIn && <Navbar handleLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={
            user.isLoggedIn ? (
              <Navigate to="/portfolio" />
            ) : (
              <Navigate to="/login" />
            )
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
          element={user.isLoggedIn ? <Portfolio userId={user.userID} /> : <Navigate to="/login" />}
        />
        <Route
  path="/market"
  element={user.isLoggedIn ? <Market userId={user.userID} /> : <Navigate to="/login" />}
/>
        <Route
          path="/transactions"
          element={user.isLoggedIn ? <Transactions /> : <Navigate to="/login" />}
        />
        <Route
          path="/about"
          element={user.isLoggedIn ? <About /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={user.isLoggedIn ? <Settings user={user} setUser={setUser} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
