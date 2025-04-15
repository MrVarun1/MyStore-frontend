import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import Header from "../Header";
import FailedView from "../FailedView";
import LoadingView from "../LoadingView";
import Button from "../../StyledComponents/Button";
import RatingModal from "../RatingModal";

import "./index.css";

const API_URL = process.env.REACT_APP_BACKEND_API;

const statusConstants = {
  LOADING: "loading",
  SUCCESS: "success",
  FAIL: "fail",
};

const sortOptions = ["store_name", "rating", "user_rating"];

const UserDashboard = () => {
  const [status, setStatus] = useState(statusConstants.LOADING);
  const [searchValue, setSearch] = useState("");
  const [sortBy, setSort] = useState(sortOptions[0]);
  const [storesList, setStores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [initialRating, setInitialRating] = useState(null);

  const token = Cookies.get("jwt_token");

  useEffect(() => {
    fetchStores(sortBy);
  }, [sortBy]);

  const fetchStores = async (sort = "store_name", search = "") => {
    try {
      setStatus(statusConstants.LOADING);

      const response = await fetch(
        `${API_URL}/user/stores?search=${search}&sort=${sort}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setStores(data.stores);
        setStatus(statusConstants.SUCCESS);
      }
    } catch (err) {
      console.log(err);
      alert(err);
      setStatus(statusConstants.FAIL);
    }
  };

  const updateRating = async (storeId, newRating, initialRating) => {
    try {
      const method = initialRating ? "PUT" : "POST";

      const response = await fetch(`${API_URL}/rating/${storeId}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: newRating }),
      });

      const data = await response.json();

      if (response.ok) {
        const { message } = data;
        await fetchStores(sortBy, searchValue);
        alert(message);
        return null;
      }
      alert(data.error);
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };

  const successView = () => {
    return (
      <div className="body-container">
        <div className="title-filter-container">
          <div>
            <h3>Stores</h3>
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
                  fetchStores(sortBy, searchValue);
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
            <h4 className="user-cell">Address</h4>
            <h4 className="user-cell">Rating</h4>
            <h4 className="user-cell">My Rating</h4>
          </li>
          {storesList.map((store) => {
            const {
              store_id: storeId,
              store_name: storeName,
              address,
              rating,
              user_rating: userRating,
            } = store;
            return (
              <li key={storeId} className="table-row">
                <p className="user-cell">{storeName}</p>
                <p className="user-cell">{address}</p>
                <p className="user-cell">{rating}</p>
                <div className="user-cell">
                  {userRating && <p>{userRating}</p>}
                  {
                    <>
                      <Button
                        type="button"
                        onClick={() => {
                          setSelectedStoreId(storeId);
                          setInitialRating(userRating || null);
                          setShowModal(true);
                        }}
                      >
                        {userRating ? "Edit Rating" : "Rate Now"}
                      </Button>
                    </>
                  }
                </div>
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
      {showModal && (
        <RatingModal
          show={showModal}
          onClose={() => setShowModal(false)}
          storeId={selectedStoreId}
          initialRating={initialRating}
          onSubmit={updateRating}
        />
      )}
      {renderBody()}
    </div>
  );
};

export default UserDashboard;
