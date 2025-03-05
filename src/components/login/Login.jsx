import './login.css';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setUserInParentComponent }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Username:", username);

        if (username === 'admin' && password === 'admin') {
            setUserInParentComponent(prevState => ({
                ...prevState,
                user: username,
                isLoggedIn: true
            }));
        } else {
            toast.error("Invalid credentials");
        }
    };

    return (
        <div className="loginform">
            <div className="main">
                <h3>Enter your login credentials</h3>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        placeholder="Enter your Username" 
                        required 
                        onChange={(event) => setUsername(event.target.value)}
                    />

                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Enter your Password" 
                        required 
                        onChange={(event) => setPassword(event.target.value)}
                    />

                    <div className="wrap">
                        <button type="submit">
                            Submit
                        </button>
                    </div>
                </form>
                
                <p>Not registered? 
                    <a href="#" style={{ textDecoration: "none" }}>
                        Create an account
                    </a>
                </p>

                {/* Toast notifications */}
                <ToastContainer />
            </div>
        </div>
    );
}

export default Login;
