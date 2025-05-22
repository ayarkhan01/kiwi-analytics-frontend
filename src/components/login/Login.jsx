import "./login.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setUserInParentComponent }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        setUserInParentComponent({
          user: username,
          isLoggedIn: true,
          userID: data.user_id,
        });
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        // Login failed
        toast.error(data.error || "Login failed", {
          position: "top-right",
          autoClose: 5001,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      toast.error("Server error. Please try again.", {
        position: "top-right",
        autoClose: 5001,
        hideProgressBar: true,
      });
    }
  };

  const handleSignup = async () => {
    const newUsername = prompt("Enter new username:");
    if (!newUsername) return;

    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;

    try {
      const response = await fetch("http://127.0.0.1:5001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserInParentComponent({
          user: newUsername,
          isLoggedIn: true,
          userID: data.user_id,
        });
        toast.success("Account created & logged in!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        toast.error(data.error || "Signup failed", {
          position: "top-right",
          autoClose: 5001,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      toast.error("Server error during signup.", {
        position: "top-right",
        autoClose: 5001,
        hideProgressBar: true,
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

          <div className="wrap">
            <button
              type="button"
              className="signup-button"
              onClick={handleSignup}
            >
              NEW USER
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;

