// navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../NavBar/navbar.css";
import logo from "../../assets/app logo.png";

const Navbar = ({ handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogoutClick = () => {
    handleLogout(); // Logs out user
    navigate("/login"); // Redirects to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/portfolio">
          <img src={logo} alt="Kiwi Analytics logo" className="navbar-logo" />
        </Link>
      </div>
      <div className="navbar-center">
        <Link
          to="/portfolio"
          className={`navbar-link ${
            isActive("/portfolio") ? "active-link" : ""
          }`}
        >
          Portfolio
        </Link>
        <Link
          to="/market"
          className={`navbar-link ${isActive("/market") ? "active-link" : ""}`}
        >
          Market
        </Link>
        <Link
          to="/transactions"
          className={`navbar-link ${isActive("/transactions") ? "active-link" : ""}`}
        >
          Transaction History
        </Link>
        <Link
          to="/about"
          className={`navbar-link ${isActive("/about") ? "active-link" : ""}`}
        >
          About
        </Link>
      </div>
      <div className="navbar-right">
        <button onClick={handleLogoutClick} className="navbar-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;