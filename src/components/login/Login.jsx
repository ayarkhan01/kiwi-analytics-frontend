import "./login.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setUserInParentComponent }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (username === "admin" && password === "admin") {
      setUserInParentComponent({
        user: username,
        isLoggedIn: true,
      });
    } else {
      // Simplified toast notification
      toast.error("Invalid credentials", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    }
  };

  return (
    <div className="loginform">
      <div className="main">
        <h3>Welcome to Kiwi Analytics!</h3>

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <span className="input-icon">
              <i className="fas fa-user"></i>
            </span>
            <input
              type="text"
              id="username"
              name="username"
              placeholder=" "
              required
              onChange={(event) => setUsername(event.target.value)}
            />
            <label htmlFor="username">Username</label>
          </div>

          <div className="input-container">
            <span className="input-icon">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              id="password"
              name="password"
              placeholder=" "
              required
              onChange={(event) => setPassword(event.target.value)}
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className="wrap">
            <button type="submit" className="login-button">
              LOGIN
            </button>
          </div>
        </form>
      </div>

      {/* Move ToastContainer outside the login form */}
      <ToastContainer />
    </div>
  );
};

export default Login;
