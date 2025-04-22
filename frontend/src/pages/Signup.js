import axios from "axios";
import { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaMapMarkerAlt, FaPhone, FaUserAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import './Signup.css';

const Signup = () => {
  useEffect(() => {
    document.body.classList.add("signup-page");
    return () => {
      document.body.classList.remove("signup-page");
    };
  }, []);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setSuccessMessage("");
      return;
    }

    if (!validatePassword(user.password)) {
      setErrorMessage(
        "Password must be at least 6 characters long and contain a mix of letters, numbers, and special characters."
      );
      setSuccessMessage("");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        password: user.password,
      });
      setSuccessMessage("Signup successful! Redirecting to login...");
      setErrorMessage("");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setErrorMessage("An error occurred during signup. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="signup-container">
      <h2>WELCOME TO RAJAA STORES</h2>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <FaUserAlt className="input-icon" />
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={user.name}
            required
          />
        </div>

        <div className="input-wrapper">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={user.email}
            required
          />
        </div>

        <div className="input-wrapper">
          <FaPhone className="input-icon" />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            value={user.phone}
            required
          />
        </div>

        <div className="input-wrapper">
          <FaMapMarkerAlt className="input-icon" />
          <input
            type="text"
            name="address"
            placeholder="Address"
            onChange={handleChange}
            value={user.address}
            required
          />
        </div>

        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={user.password}
            required
          />
        </div>

        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            value={user.confirmPassword}
            required
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>

      <div className="message">
        {successMessage && <p className="success">{successMessage}</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>

      <div className="login-link">
        <p>Already have an account? <Link to="/">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;
