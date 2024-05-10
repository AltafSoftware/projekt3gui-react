import React from 'react';
import { Link } from 'react-router-dom';
// import '../styles/HomePage.css'; // Ensure the path to your CSS file is correct

function HomePage() {
  console.log("HomePage is rendering"); // Add this line to check if HomePage is being rendered
  return (
    <div>
      <h1 style={{ fontWeight: 'bold' }}>DRUKSPIL</h1>
      <Link to="/registrering">
        <button>Gå til registrering!</button>
      </Link>
    </div>
  );
}


export default HomePage;
