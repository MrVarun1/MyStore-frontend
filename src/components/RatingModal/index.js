import { useState, useEffect } from "react";
import Button from "../../StyledComponents/Button";

import "./index.css";

const RatingModal = ({ show, onClose, storeId, initialRating, onSubmit }) => {
  const [rating, setRating] = useState(initialRating);

  useEffect(() => {
    setRating(initialRating); // reset when store changes
  }, [initialRating, storeId]);

  const handleSubmit = () => {
    if (rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    onSubmit(storeId, rating, initialRating); // Call parent-provided handler
    onClose(); // Close modal after submit
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Rate This Store</h3>
        <div className="rating-buttons">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              className={rating === num ? "selected" : ""}
              onClick={() => setRating(num)}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="modal-actions">
          <Button type="button" onClick={handleSubmit}>
            Submit
          </Button>
          <Button onClick={onClose} className="cancel">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
