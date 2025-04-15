import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import Header from "../Header";
import FailedView from "../FailedView";
import LoadingView from "../LoadingView";

import "./index.css";

const API_URL = process.env.REACT_APP_BACKEND_API;

const statusConstants = {
  LOADING: "loading",
  SUCCESS: "success",
  FAIL: "fail",
};

const AdminDashboard = () => {
  const [status, setStatus] = useState(statusConstants.LOADING);
  const [totals, setTotals] = useState({});

  const token = Cookies.get("jwt_token");

  useEffect(() => {
    fetchTotals();
  }, []);

  const fetchTotals = async () => {
    try {
      setStatus(statusConstants.LOADING);

      const response = await fetch(`${API_URL}/admin/totals`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok) {
        const { totals } = data;
        setTotals(totals);
        setStatus(statusConstants.SUCCESS);
      }
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };

  const successView = () => {
    const { total_users, total_stores, total_ratings } = totals;
    return (
      <div className="admin-body">
        <dl>
          <dt>Total number of Users:</dt>
          <dd>{total_users}</dd>

          <dt>Total number of Stores:</dt>
          <dd>{total_stores}</dd>

          <dt>Total number of Ratings:</dt>
          <dd>{total_ratings}</dd>
        </dl>
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

export default AdminDashboard;
