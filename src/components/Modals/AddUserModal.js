import React, { useState } from "react";
import Cookies from "js-cookie";
import "./Modal.css";

const API_URL = process.env.REACT_APP_BACKEND_API;

const AddUserModal = ({ onClose }) => {
  const token = Cookies.get("jwt_token");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { name, email, password, address, role } = formData;

    if (!name || !email || !password || !address) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.error || "Something went wrong");
      } else {
        alert("User added successfully");
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add User</h3>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        <div className="modal-actions">
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Submit"}
          </button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
