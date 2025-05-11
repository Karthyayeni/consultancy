import emailjs from '@emailjs/browser';
import React, { useRef } from 'react';
import './Contact.css';

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_buammdj', 'template_oeom3gi', form.current, 'bPG7trvceTvRGg3tv')
      .then(
        () => {
          alert('Message sent successfully!');
          form.current.reset();
        },
        (error) => {
          alert('Failed to send message. Try again later.');
          console.error(error.text);
        }
      );
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact RAJAA STORES 🛒</h1>
      <p className="contact-subtitle">
        Have questions? Need help? Fill out the form below and we’ll get back to you!
      </p>
      <form className="contact-form" ref={form} onSubmit={sendEmail}>
        <label htmlFor="name">Your Name</label>
        <input type="text" name="user_name" id="name" placeholder="Enter your name" required />

        <label htmlFor="email">Your Email</label>
        <input type="email" name="user_email" id="email" placeholder="Enter your email" required />

        <label htmlFor="subject">Subject</label>
        <input type="text" name="subject" id="subject" placeholder="What's this about?" required />

        <label htmlFor="message">Message</label>
        <textarea name="message" id="message" placeholder="Write your message..." required></textarea>

        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
