import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import '../styles/Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // Corrected history to navigate

  async function register(e) { 
    e.preventDefault();

    if (!username) {
      alert("Username cannot be empty");
      return; 
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // Check for uppercase letter, number, and special character
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasNumber || !hasSpecialChar) {
      alert("Password must contain at least one uppercase letter, one number, and one special character");
      return;
    }

    if (password !== confirmpassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/register", { username, password });
      
      if (res.data.message === "exist") {
        alert("Username already exists. Try logging in.");
      } else if (res.data.message === "success") {
        const token = res.data.token;

        // Store the token in localStorage or sessionStorage
        localStorage.setItem("token", token);
        
        localStorage.removeItem('selectedTableId');
        // Redirect to dashboard or other protected route
        navigate("/dashboard");
       
        console.log("Registration successful, token stored.");
      }
    } catch (err) {
      alert("An error occurred during registration.");
      console.log(err);
    }
  }

  return (
    <div className="login-page">
      <div className="register-container">
        <h2>Customer Register</h2>
        <form>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmpassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" onClick={register}>Register</button>

        </form>
        <div>
        
        </div>
      </div>
      </div>
    
  );
}

export default Register;
