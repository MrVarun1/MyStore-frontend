import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import Header from "../../components/Header";
import FailedView from "../../components/FailedView";
import LoadingView from "../../components/LoadingView";
import Button from "../../StyledComponents/Button";

import "./index.css";

const API_URL = process.env.REACT_APP_BACKEND_API;

const statusConstants = {
  LOADING: "loading",
  SUCCESS: "success",
  FAIL: "fail",
};

const sortOptions = ["name", "rating", "role"];

const Users = () => {
  const [status, setStatus] = useState(statusConstants.LOADING);
  const [searchValue, setSearch] = useState("");
  const [sortBy, setSort] = useState(sortOptions[0]);
  const [usersList, setUserslist] = useState([]);

  const token = Cookies.get("jwt_token");

  useEffect(() => {
    fetchUsersList(sortBy);
  }, [sortBy]);

  const fetchUsersList = async (sort = "name", search = "") => {
    try {
      setStatus(statusConstants.LOADING);

      const response = await fetch(
        `${API_URL}/admin/users?search=${search}&sort=${sort}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        const { users } = data;
        setUserslist(users);
        setStatus(statusConstants.SUCCESS);
        return 0;
      }

      console.log(data);
      alert(data.error);
    } catch (err) {
      console.log(err);
      alert(err);
      setStatus(statusConstants.FAIL);
    }
  };

  const successView = () => {
    return (
      <div className="body-container">
        <div className="title-filter-container">
          <div>
            <h3>Users</h3>
          </div>
          <div className="filter-container">
            <div className="filter">
              <label htmlFor="sortInput">Sort By</label>
              <select
                id="sortInput"
                value={sortBy}
                onChange={(e) => {
                  setSort(e.target.value);
                }}
              >
                {sortOptions.map((each) => (
                  <option key={each} value={each}>
                    {each}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter">
              <input
                type="search"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  fetchUsersList(sortBy, searchValue);
                }}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
        <ul className="list-container">
          <li className="table-row head-row">
            <h4 className="user-cell">Name</h4>
            <h4 className="user-cell">Email</h4>
            <h4 className="user-cell">Address</h4>
            <h4 className="user-cell">Role</h4>
            <h4 className="user-cell">Rating</h4>
          </li>
          {usersList.map((user) => {
            const {
              user_id: userId,
              name,
              email,
              address,
              role,
              rating,
            } = user;
            return (
              <li key={userId} className="table-row">
                <p className="user-cell">{name}</p>
                <p className="user-cell">{email}</p>
                <p className="user-cell">{address}</p>
                <p className="user-cell">{role}</p>
                <p className="user-cell">{rating ? rating : "N/A"}</p>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderBody = () => {
    switch (status) {
      case statusConstants.LOADING:
        return <LoadingView />;
      case statusConstants.FAIL:
        return <FailedView />;
      case statusConstants.SUCCESS:
        return successView();
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <Header />
      {renderBody()}
    </div>
  );
};

export default Users;
