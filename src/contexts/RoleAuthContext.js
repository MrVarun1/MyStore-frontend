import { createContext } from "react";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const RoleAuthContext = createContext();

export const RoleProvider = ({ children }) => {
  const [user, setUser] = useState();

  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove("jwt_token");
    navigate("/login");
    setUser(null);
  };

  const login = (data) => {
    const { message, token, role } = data;
    alert(message);
    Cookies.set("jwt_token", token, { expires: 1 });
    Cookies.set("role", role, { expires: 1 });
    navigate("/");
  };

  return (
    <RoleAuthContext.Provider value={{ user, setUser, logout, login }}>
      <>{children}</>
    </RoleAuthContext.Provider>
  );
};

export default RoleAuthContext;
