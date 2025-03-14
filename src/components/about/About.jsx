import React from "react";
import { Author } from "./Author";
import max from "../../assets/max.jpg";
import ahmed from "../../assets/ahmed.jpeg";
import member3 from "../../assets/Jose.jpg";
import member4 from "../../assets/member4.jpg";
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
    image: member3,
    position: "Finance Analyst",
    description: "Financial especialist with experience in data analysis",
  },

  {
    name: "David",
    image: member4,
    position: "Developer",
    description: "Cloud Architect",
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
