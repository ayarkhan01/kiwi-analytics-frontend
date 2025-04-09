import React from "react";
import { Author } from "./Author";
import max from "../../assets/max.jpg";
import ahmed from "../../assets/ahmed.jpeg";
import Jose from "../../assets/Jose.jpg";
import Jean from "../../assets/Jean.jpg";
import Khuong from "../../assets/khuong.jpg";
import "./about.css";

// Team members data
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
  {
    name: "Khuong",
    image: Khuong,
    position: "Data Accounting Analyst",
    description: "Accounting and report analysis",
  },
];

const About = ({ setUserInParentComponent }) => {
  const handleLogout = (event) => {
    event.preventDefault();
    setUserInParentComponent((prevState) => ({
      ...prevState,
      isLoggedIn: false, // Set logged out state
    }));
  };

  return (
    <div className="about-container">
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

      <div className="glass-card about-mission">
        <h2>Our Mission</h2>
        <p>
          At Kiwi Analytics, we are dedicated to bringing sophisticated
          financial analysis tools to everyday investors. Our platform combines
          cutting-edge technology with intuitive design to help you make
          informed investment decisions.
        </p>
        <p>
          Founded in 2023, our team of financial experts and technology
          specialists work together to democratize access to powerful financial
          analytics that were once only available to institutional investors.
        </p>
      </div>
    </div>
  );
};

export default About;
