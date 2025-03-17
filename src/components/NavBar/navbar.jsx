import { Link, useNavigate } from "react-router-dom";
import '../NavBar/navbar.css';
import logo from "../../assets/app logo.jpg";

const Navbar = ({ handleLogout }) => {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        handleLogout(); // Logs out user
        navigate("/login"); // Redirects to login page
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img src={logo} alt="app logo" className="navbar-logo" />
            </div>
            <div className="navbar-center">
                <Link to="/portfolio" className="navbar-link">Portfolio</Link>
                <Link to="/market" className="navbar-link">Market</Link>
                <Link to="/about" className="navbar-link">About</Link>
            </div>
            <div className="navbar-right">
                <button onClick={handleLogoutClick} className="navbar-button">Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;