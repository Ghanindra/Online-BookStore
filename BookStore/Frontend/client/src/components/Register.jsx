import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./register.css"
const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    isAdmin: false
  });
  const navigate = useNavigate();
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5023/api/auth/register", formData);
      toast.success("Registered Successfully ✅");
      navigate("/login");
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      toast.error(err.response?.data || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <label>
        <input type="checkbox" name="isAdmin" onChange={handleChange} />
        Register as Admin
      </label>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
