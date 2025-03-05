import { useState } from 'react';
import Login from './components/login/Login.jsx';
import About from './components/about/About.jsx';

function App() {
  const [user, setUser] = useState({
    user: '',
    isLoggedIn: false
  });

  return (
    <>
      {user.isLoggedIn ? (
        <About setUserInParentComponent={setUser} />
      ) : (
        <Login setUserInParentComponent={setUser} />
      )}
    </>
  );
}

export default App;
