import { useContext, useEffect, useState } from "react";
import Header from "../Header";
import Cookies from "js-cookie";

import FailedView from "../FailedView";
import LoadingView from "../LoadingView";

import "./index.css";
import RoleAuthContext from "../../contexts/RoleAuthContext";
import Button from "../../StyledComponents/Button";

const API_URL = process.env.REACT_APP_BACKEND_API;

const statusConstants = {
  LOADING: "loading",
  SUCCESS: "success",
  FAIL: "fail",
};

const sortOptions = ["name", "rating"];

const OwnerDashboard = () => {
  const [usersRatings, setUserRatings] = useState(null);
  const [status, setStatus] = useState(statusConstants.LOADING);
  const [searchValue, setSearch] = useState("");
  const [sortBy, setSort] = useState(sortOptions[0]);

  const { setUser } = useContext(RoleAuthContext);

  useEffect(() => {
    fetchUserRatings(sortBy);
  }, [sortBy]);

  const fetchUserRatings = async (sort = "name", search = "") => {
    try {
      setStatus(statusConstants.LOADING);

      const token = Cookies.get("jwt_token");

      const response = await fetch(
        `${API_URL}/store/users?search=${search}&sort=${sort}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        const { store_details, users_ratings } = data;

        setUser({
          storeName: store_details.store_name,
          storeId: store_details.store_id,
          storeRating: store_details.rating,
        });

        setUserRatings(users_ratings);

        setStatus(statusConstants.SUCCESS);
        return null;
      }
      setStatus(statusConstants.FAIL);
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
            <h3>User Ratings</h3>
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
                  fetchUserRatings(sortBy, searchValue);
                }}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
        <ul className="list-container">
          <li className="table-row head-row">
            <h4 className="cell">Name</h4>
            <h4 className="cell">Rating</h4>
          </li>
          {usersRatings.map((user) => (
            <li key={user.user_id} className="table-row">
              <p className="cell">{user.name}</p>
              <p className="cell">{user.rating}</p>
            </li>
          ))}
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

export default OwnerDashboard;
