import { useState } from "react";

import Button from "../../StyledComponents/Button";
import "./Modal.css";

const ChangePasswordModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    const { old_password, new_password, confirm_password } = formData;

    if (!old_password || !new_password || !confirm_password) {
      alert("All fields are required");
      return;
    }

    if (new_password !== confirm_password) {
      alert("New password and confirm password do not match");
      return;
    }

    if (new_password.length < 8) {
      alert("New password must be at least 8 characters");
      return;
    }

    onSubmit({ old_password, new_password });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Change Password</h3>
        <input
          type="password"
          name="old_password"
          placeholder="Old Password"
          onChange={handleChange}
        />
        <input
          type="password"
          name="new_password"
          placeholder="New Password"
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm New Password"
          onChange={handleChange}
        />

        <div className="modal-actions">
          <Button onClick={handleSubmit}>Submit</Button>
          <Button className="cancel" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
