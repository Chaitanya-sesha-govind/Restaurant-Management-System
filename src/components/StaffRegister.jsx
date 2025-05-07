import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import '../styles/Register.css';

function StaffRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('staff'); // Default role set to 'staff'
  const navigate = useNavigate();

  async function register(e) {
    e.preventDefault();

    // Form validation
    if (!username) {
      alert("Username cannot be empty");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasNumber || !hasSpecialChar) {
      alert("Password must contain at least one uppercase letter, one number, and one special character");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      // Send registration request to the backend
      const res = await axios.post("http://localhost:4000/staff-register", { username, password, role });

      if (res.data.message === "exist") {
        alert("Username already exists. Try logging in.");
      } else if (res.data.message === "success") {
        const token = res.data.token;

        // Store the token in localStorage
        localStorage.setItem("token", token);

        // Redirect to the staff dashboard or other protected route
        navigate("/dashboard");

        console.log("Staff registration successful, token stored.");
      }
    } catch (err) {
      alert("An error occurred during registration.");
      console.log(err);
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Staff Register</h2>
        <form onSubmit={register}>
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
         
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default StaffRegister;