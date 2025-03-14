import React from "react";
import { Author } from "./Author";
import max from "../../assets/max.jpg";
import ahmed from "../../assets/ahmed.jpeg";
import Jose from "../../assets/Jose.jpg";
import Jean from "../../assets/Jean.jpg";
import "./about.css";

// Import Each Persons Image Above. Images stored in assets folder. Descriptions and Positions below.
const teamMembers = [
  {
    name: "Max",
    image: max,
    position: "Junior Developer",
    description: "Frontend Developer with skills in css, python, javascript",
  },

  {
    name: "Ahmed",
    image: ahmed,
    position: "CEO",
    description: "FinTech and Machine Learning Specialist",
  },

  {
    name: "Jose",
    image: Jose,
    position: "Finance Analyst",
    description: "Financial especialist with experience in data analysis",
  },

  {
    name: "Jean",
    image: Jean,
    position: "Intern",
    description: "Hard working MS FinTech student with a passion for coding",
  },
];

const About = ({ setUserInParentComponent }) => {
  const handleLogout = () => {
    console.log("hello");
    setUserInParentComponent({
      isLoggedIn: false, // Set logged out state
    });
  };

  return (
    <>
      <h1 className="title">Meet the Team</h1>
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <Author
            key={index}
            name={member.name}
            image={member.image}
            description={member.description}
            position={member.position}
          />
        ))}
      </div>
    </>
  );
};

export default About;
