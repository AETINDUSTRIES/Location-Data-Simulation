import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import "../App.css";
import { MdCancel } from "react-icons/md";

export default function AuthForm() {
  const { signIn, authError, loading } = useUserContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(formData.email, formData.password);
  };

  return (
    <div
      style={{ position: "absolute", height: "100%", width: "100%" }}
      className="form-background"
    >
      <div className="form-container">
        <div className="form-header">
          <div className="form-title">
            <h3>Login</h3>
            <p>Enter your credentials to access the app</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="label">Email</label>
            <input
              className="input-field col"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="label">Password</label>
            <input
              className="input-field col"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {authError && <p className="error-msg">{authError}</p>}

          <div className="btn-container">
            <button className="btn-start" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
