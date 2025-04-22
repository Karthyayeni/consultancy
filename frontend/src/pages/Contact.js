import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact RAJAA STORES 🛒</h1>
      <p className="contact-subtitle">
        Have questions? Need help? Fill out the form below and we’ll get back to you!
      </p>
      <form className="contact-form">
        <label htmlFor="name">Your Name</label>
        <input type="text" id="name" placeholder="Enter your name" required />

        <label htmlFor="email">Your Email</label>
        <input type="email" id="email" placeholder="Enter your email" required />

        <label htmlFor="subject">Subject</label>
        <input type="text" id="subject" placeholder="What's this about?" required />

        <label htmlFor="message">Message</label>
        <textarea id="message" placeholder="Write your message..." required></textarea>

        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
