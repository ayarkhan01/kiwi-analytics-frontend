import React from 'react'
import Author from './Author'

const About = ({setUserInParentComponent}) => {
    const handleLogout = () => {
        console.log("hello");
        setUserInParentComponent({
            isLoggedIn: false  // Set logged out state
        });
    };

    return (
        <>
            <h1>About</h1>
            <Author />
            <Author />
            <button onClick={handleLogout}>Click me to logout</button>
        </>
    )
}
export default About
