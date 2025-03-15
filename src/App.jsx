import { useState } from 'react';
import Login from './components/login/Login.jsx';
import About from './components/about/About.jsx';
import Navbar from './components/NavBar/navbar.jsx';

function App() {
  const [user, setUser] = useState({
    user: '',
    isLoggedIn: false
  });

  const handleLogout = () => {
    setUser((prevState) => ({
      ...prevState,
      isLoggedIn: false
    }));

    setUser(() => ({
      isLoggedIn: false
    }));
  };

  return (
    <>
      <Navbar />    
      {user.isLoggedIn ? (
        <About setUserInParentComponent={setUser} />
      ) : (
        <Login setUserInParentComponent={setUser} />
      )}
    </>
  );
}

export default App;