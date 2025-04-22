import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About <span className="about-highlight">RAJAA STORES</span></h1>

      <div className="about-section">
        <h3>Who We Are</h3>
        <p>
          RAJAA STORES is your one-stop destination for all your grocery needs. Based in Tamil Nadu, 
          we pride ourselves on offering fresh, affordable, and high-quality products that serve every household.
        </p>
      </div>

      <div className="about-section">
        <h3>Our Mission</h3>
        <p>
          To bring convenience, quality, and tradition to your doorstep. We aim to blend technology with trust, 
          ensuring a smooth and satisfying shopping experience for every customer.
        </p>
      </div>

      <div className="about-section">
        <h3>Why Choose Us?</h3>
        <p>
          💚 Locally sourced products<br />
          🚚 Fast and reliable delivery<br />
          📦 Wide range of essential categories<br />
          🙌 Customer-first approach
        </p>
      </div>

      <div className="about-section">
        <h3>We’re Growing</h3>
        <p>
          From humble beginnings to a growing digital presence, RAJAA STORES continues to serve with passion and commitment.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
