import { useState, useContext } from "react";
import RoleAuthContext from "../../contexts/RoleAuthContext";
import Button from "../../StyledComponents/Button";
import { useNavigate } from "react-router-dom";

import "./index.css";

const API_URL = process.env.REACT_APP_BACKEND_API;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setError] = useState("");

  const { login } = useContext(RoleAuthContext);

  const navigate = useNavigate();

  const submitEventHandler = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmail("");
        setPassword("");
        login(data);
        return null;
      }
      console.log(data.error);
      setError(data.error);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login">
      <div className="card">
        <h1>Log In</h1>
        <form onSubmit={submitEventHandler}>
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
          {errorMessage && <p>{errorMessage}</p>}
          <Button type="submit">Log In</Button>
          <Button
            type="button"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign Up
          </Button>
        </form>
      </div>
      <div className="test-credentials">
        <h4>Demo Credentials</h4>
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Email</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Admin</td>
              <td>admin@example.com</td>
              <td>Admin2@1234</td>
            </tr>
            <tr>
              <td>Owner</td>
              <td>owner@example.com</td>
              <td>Owner@1234</td>
            </tr>
            <tr>
              <td>User</td>
              <td>user2@example.com</td>
              <td>User2@1234</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Login;
