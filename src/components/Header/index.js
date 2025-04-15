import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { TiPlus } from "react-icons/ti";

import RoleAuthContext from "../../contexts/RoleAuthContext";
import Button from "../../StyledComponents/Button";
import AddUserModal from "../Modals/AddUserModal";
import AddStoreModal from "../Modals/AddStoreModal";
import ChangePasswordModal from "../Modals/ChangePasswordModal";

import "./index.css";

const API_URL = process.env.REACT_APP_BACKEND_API;

const Header = () => {
  const { user, logout } = useContext(RoleAuthContext);
  const role = Cookies.get("role");
  const navigate = useNavigate();

  const token = Cookies.get("jwt_token");

  const [showChangePassword, setShowChangePassword] = useState(false);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    if (showAddStore) {
      fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const ownerUsers = data.users.filter((user) => user.role === "owner");
          setOwners(ownerUsers);
        });
    }
  }, [showAddStore]);

  return (
    <header className="header">
      <h2
        className="title"
        onClick={() => {
          navigate("/");
        }}
      >
        Store Rating System
      </h2>

      {/* Role-specific controls */}

      {role === "owner" && (
        <div>
          <span className="store-details">{user?.storeName}</span>
          <span className="store-details">Rating: {user?.storeRating}</span>
        </div>
      )}

      {role === "admin" && (
        <nav>
          <Button type="button" onClick={() => setShowAddUser(true)}>
            <TiPlus color="#ffffff" />
            User
          </Button>
          <Button
            type="button"
            onClick={() => {
              setShowAddStore(true);
            }}
          >
            <TiPlus color="#ffffff" />
            Store
          </Button>
          <Button type="button" onClick={() => navigate("/admin/users")}>
            Users
          </Button>
          <Button type="button" onClick={() => navigate("/admin/stores")}>
            Stores
          </Button>
        </nav>
      )}

      <div>
        <Button type="button" onClick={() => setShowChangePassword(true)}>
          Change Password
        </Button>

        <Button type="button" onClick={logout}>
          Logout
        </Button>
      </div>

      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => setShowChangePassword(false)}
          onSubmit={(formData) => {
            fetch(`${API_URL}/change-password`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(formData),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.error) {
                  alert(data.error);
                } else {
                  alert("Password changed successfully");
                }
              });
          }}
        />
      )}

      {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} />}

      {showAddStore && (
        <AddStoreModal
          onClose={() => setShowAddStore(false)}
          ownerList={owners}
        />
      )}
    </header>
  );
};

export default Header;
