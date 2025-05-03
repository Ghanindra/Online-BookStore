import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./login.css"
import { useNavigate } from 'react-router-dom';

import "react-toastify/dist/ReactToastify.css"
const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
 const navigate = useNavigate(); // For redirect
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5023/api/auth/login", formData);
      toast.success("Login successful ✅");
      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true); // ✅ update auth state
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data || "Login failed");
    }
  };

  return (
    <form className="formed" onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
