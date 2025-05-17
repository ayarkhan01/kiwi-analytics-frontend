import React, { useEffect, useState } from "react";
import { Author } from "./Author";
import "./about.css";

const About = ({ setUserInParentComponent }) => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/team");
        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      }
    };

    fetchTeam();
  }, []);

  return (
    <div className="about-container">
      <h1 className="title">Meet the Team</h1>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <Author
            key={index}
            name={member.name}
            image={member.image} // This should ideally be a URL if coming from the backend
            description={member.description}
            position={member.position}
          />
        ))}
      </div>

      <div className="glass-card about-mission">
        <h2>Our Mission</h2>
        <p>
          At Kiwi Analytics, we are dedicated to bringing sophisticated
          financial analysis tools to everyday investors...
        </p>
      </div>
    </div>
  );
};

export default About;

