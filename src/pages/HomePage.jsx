import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // Ensure this path is correct

function HomePage() {
  return (
    <div className="homepage-body">
      <h1 className="homepage-heading">DRUKSPIL</h1>
      <Link to="/registrering">
        <button className="homepage-button">Gå til registrering!</button>
      </Link>
    </div>
  );
}

export default HomePage;