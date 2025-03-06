import React from "react";

export function Author({ name, image, description }) {
    return (
      <div className="team-card">
        <img src={image} alt={name} className="team-photo" />
        <h3 className="team-name">{name}</h3>
        <p className="team-description">{description}</p>
      </div>
    );
  }
