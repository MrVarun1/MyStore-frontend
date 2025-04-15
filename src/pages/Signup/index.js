import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import Button from "../../StyledComponents/Button";

const API_URL = process.env.REACT_APP_BACKEND_API;

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setError] = useState("");

  const navigate = useNavigate();

  const token = Cookies.get("jwt_token");

  const signupEvent = async (e) => {
    e.preventDefalut();
    try {
      if (password.length < 8 || password.length > 16) {
        setError("Password length must be between 8 and 16");
        return 0;
      }

      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, address }),
      });
    } catch (err) {
      console.log(err.error);
      setError(err.error);
    }
  };

  return (
    <div className="login">
      <div className="card">
        <h1>Sign Up</h1>
        <form onSubmit={signupEvent}>
          <div className="input-container">
            <label htmlFor="nameInput">Name</label>
            <input
              type="text"
              id="nameInput"
              required
              placeholder="Enter your Name"
              value={name}
              minLength="5"
              maxLength="60"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="input-container">
            <label htmlFor="emailInput">Email</label>
            <input
              type="email"
              id="emailInput"
              required
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="input-container">
            <label htmlFor="passwordInput">Password</label>
            <input
              type="password"
              id="passwordInput"
              required
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              minLength="8"
              maxLength="16"
            />
          </div>
          <div className="input-container">
            <label htmlFor="addressInput">Address</label>
            <textarea
              id="addressInput"
              required
              placeholder="Enter your Address"
              value={address}
              maxLength="400"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </div>
          {errorMessage && <p>{errorMessage}</p>}
          <Button type="submit">Sign Up</Button>
          <Button
            type="button"
            onClick={() => {
              navigate("/login");
            }}
          >
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
