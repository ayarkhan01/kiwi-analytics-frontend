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
import Navbar from "./components/NavBar/navbar.jsx";
import "./index.css";

function App() {
  const [user, setUser] = useState({
    user: "",
    isLoggedIn: false,
  });

  const handleLogout = () => {
    setUser({ user: "", isLoggedIn: false });
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
          element={user.isLoggedIn ? <Portfolio /> : <Navigate to="/login" />}
        />
        <Route
          path="/market"
          element={user.isLoggedIn ? <Market /> : <Navigate to="/login" />}
        />
        <Route
          path="/about"
          element={user.isLoggedIn ? <About /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
