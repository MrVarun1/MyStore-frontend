import React, { useState } from "react";
import Cookies from "js-cookie";
import "./Modal.css";

const API_URL = process.env.REACT_APP_BACKEND_API;

const AddStoreModal = ({ onClose, ownerList }) => {
  const token = Cookies.get("jwt_token");

  const [formData, setFormData] = useState({
    store_name: "",
    email: "",
    address: "",
    owner_user_id: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { store_name, email, address, owner_user_id } = formData;

    if (!store_name || !email || !address || !owner_user_id) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/store`, {
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
        alert("Store added successfully");
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
        <h3>Add Store</h3>
        <input
          name="store_name"
          placeholder="Store Name"
          onChange={handleChange}
        />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <select
          name="owner_user_id"
          value={formData.owner_user_id}
          onChange={handleChange}
        >
          <option value="">Select Owner</option>
          {ownerList.map((owner) => (
            <option key={owner.user_id} value={owner.user_id}>
              {owner.name}
            </option>
          ))}
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

export default AddStoreModal;
