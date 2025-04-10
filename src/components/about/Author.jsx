import React from "react";

export function Author({ name, image, description, position }) {
  // Function to truncate text if too long
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div className="team-card">
      <img src={image} alt={name} className="team-photo" />
      <h3 className="team-name">{name}</h3>
      <h4 className="team-position">{position}</h4>
      <p className="team-description">{description}</p>
    </div>
  );
}
