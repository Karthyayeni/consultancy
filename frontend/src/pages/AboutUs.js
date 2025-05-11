import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1 className="about-title">About <span className="about-highlight">RAJAA STORES</span></h1>
        <p className="about-tagline">Delivering Quality & Tradition Since 1995</p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h2 className="section-title">Our Story</h2>
          <div className="about-story">
            <div className="story-content">
              <p>
                Founded in 1995 by Mr. Rajasekaran in a small neighborhood of Tamil Nadu, RAJAA STORES began as a modest family-run grocery shop with a vision to provide fresh, quality products to the local community. What started as a small venture with just a handful of essential items has now grown into a trusted name across the region.
              </p>
              <p>
                Over the years, we've expanded our inventory, improved our supply chain, and embraced technology to better serve our customers. Despite our growth, we've remained true to our founding principles: quality, affordability, and customer satisfaction.
              </p>
              <p>
                In 2020, we took a significant step forward by launching our online platform, allowing us to reach more customers while maintaining the personal touch that has been our hallmark for decades.
              </p>
            </div>
            <div className="story-highlights">
              <div className="milestone">
                <span className="year">1995</span>
                <p>First store opened in Tamil Nadu</p>
              </div>
              <div className="milestone">
                <span className="year">2005</span>
                <p>Expanded to 3 physical locations</p>
              </div>
              <div className="milestone">
                <span className="year">2020</span>
                <p>Launched online grocery platform</p>
              </div>
              <div className="milestone">
                <span className="year">2023</span>
                <p>Serving 50,000+ customers monthly</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2 className="section-title">Our Mission & Values</h2>
          <div className="mission-values">
            <div className="mission-box">
              <h3>Our Mission</h3>
              <p>
                To bring convenience, quality, and tradition to your doorstep by creating a seamless shopping experience that honors South Indian culture and cuisine while embracing modern technology and sustainable practices.
              </p>
            </div>
            <div className="values-container">
              <h3>Our Core Values</h3>
              <div className="values-grid">
                <div className="value-item">
                  <h4>Quality</h4>
                  <p>We never compromise on the quality of our products, ensuring that only the best reaches your kitchen.</p>
                </div>
                <div className="value-item">
                  <h4>Integrity</h4>
                  <p>Honesty and transparency in all our dealings with customers, suppliers, and employees.</p>
                </div>
                <div className="value-item">
                  <h4>Community</h4>
                  <p>Supporting local farmers and producers to strengthen our community and economy.</p>
                </div>
                <div className="value-item">
                  <h4>Sustainability</h4>
                  <p>Committed to environmentally friendly practices in packaging and operations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2 className="section-title">What Sets Us Apart</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Farm Fresh Products</h3>
              <p>Direct partnerships with over 100 local farmers ensuring freshness and supporting local agriculture.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Express Delivery</h3>
              <p>Same-day delivery within 3 hours in select areas, with careful handling to preserve product quality.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💯</div>
              <h3>Quality Assurance</h3>
              <p>Rigorous quality checks at multiple stages from sourcing to delivery to ensure premium products.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h3>Wide Selection</h3>
              <p>Over 5,000 products across categories including regional specialties and traditional South Indian items.</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2 className="section-title">Our Products</h2>
          <div className="product-categories">
            <div className="category">
              <h3>Fresh Produce</h3>
              <p>Farm-fresh vegetables and fruits sourced directly from local farmers with minimal transit time.</p>
            </div>
            <div className="category">
              <h3>Dairy Products</h3>
              <p>Fresh milk, curd, paneer, and other dairy essentials from trusted local dairies.</p>
            </div>
            <div className="category">
              <h3>Rice & Grains</h3>
              <p>Premium quality rice varieties including traditional South Indian varieties like Ponni, Sona Masoori, and more.</p>
            </div>
            <div className="category">
              <h3>Spices & Masalas</h3>
              <p>Authentic spice blends ground in-house following traditional Tamil recipes passed down through generations.</p>
            </div>
            <div className="category">
              <h3>Ready-to-Cook</h3>
              <p>Traditional South Indian breakfast and meal mixes prepared with authentic recipes for convenience.</p>
            </div>
            <div className="category">
              <h3>Household Essentials</h3>
              <p>Complete range of household necessities to fulfill all your home needs.</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2 className="section-title">Our Commitment to Sustainability</h2>
          <div className="sustainability-content">
            <p>
              At RAJAA STORES, we recognize our responsibility toward the environment and future generations. Our sustainability initiatives include:
            </p>
            <ul className="sustainability-list">
              <li>Eco-friendly packaging using biodegradable materials</li>
              <li>Reduced plastic usage across our supply chain</li>
              <li>Support for organic farming practices</li>
              <li>Energy-efficient storage facilities</li>
              <li>Waste reduction programs and composting of organic waste</li>
            </ul>
            <p>
              We are continuously working to minimize our carbon footprint while maximizing our positive impact on the community.
            </p>
          </div>
        </div>

        <div className="about-section contact-section">
          <h2 className="section-title">Connect With Us</h2>
          <div className="contact-info">
            <div className="contact-item">
              <h3>Visit Our Main Store</h3>
              <p>26, Mariyamman Kovil street,Kanagapuram</p>
              <p>Erode,Tamil Nadu-638112</p>
            </div>
            <div className="contact-item">
              <h3>Business Hours</h3>
              <p>Monday - Saturday: 7:00 AM - 9:00 PM</p>
              <p>Sunday: 8:00 AM - 8:00 PM</p>
            </div>
            <div className="contact-item">
              <h3>Contact Us</h3>
              <p>Phone: +91 98765 43210</p>
              <p>Email: rajastorekan21@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;