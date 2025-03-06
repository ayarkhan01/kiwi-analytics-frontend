import React from 'react'
import { Author } from "./Author";
import max from "./assets/max.jpg";
import member2 from "./assets/member2.jpg";
import member3 from "./assets/member3.jpg";
import member4 from "./assets/member4.jpg";
import "./about.css"

const teamMembers = [
    {name: "Max",
     image: max,
     description: "Frontend Developer with skills in css, python, javascript, and mostly no skills" },
    
    {name: "Bob",
     image: member2,
     description: "Backend Specialist" },
    
    {name: "Charlie",
     image: member3,
     description: "Machine Learning Expert" },
    
    {name: "David",
     image: member4,
     description: "Cloud Architect" },
];

const About = ({setUserInParentComponent}) => {
    const handleLogout = () => {
        console.log("hello");
        setUserInParentComponent({
            isLoggedIn: false  // Set logged out state
        });
    };

    return (
        <>
          <div className="header">
            <h1 className="title">Meet the Team</h1>
            <button className="logout-button" onClick={handleLogout}>Logout</button>  
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <Author
                key={index}
                name={member.name}
                image={member.image}
                description={member.description}
              />
            ))}
          </div>

        </>
      );
    };
    
    export default About;