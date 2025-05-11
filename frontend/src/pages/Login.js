import axios from "axios";
import { useEffect, useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", user);

      if (response.data.token) {
        const expiryTime = new Date().getTime() + 60 * 60 * 1000;
        localStorage.setItem("UserId", response.data.user.id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.user.name);
        localStorage.setItem("password", response.data.user.password);
        localStorage.setItem("tokenExpiry", expiryTime);

        alert("Login successful!");
        if (response.data.user.email === "admin@admin.com") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        alert("Invalid login credentials!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");
    
    if (token && expiry && new Date().getTime() < expiry) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="signup-container">
      <h2>WELCOME TO RAJAA STORES</h2>
      <h2>LOGIN</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <FaEnvelope className="input-icon" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} value={user.email} required />
        </div>
        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} value={user.password} required />
        </div>
        <button type="submit">Login</button>
      </form>

      <div className="signup-link">
        <p>Don't have an account? <Link to="/signup">Create an account</Link></p>
      </div>
    </div>
  );
};

export default Login;
