import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:3000/api/data");
      setData(response.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Error: {error}</h1>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>RAD App - Frontend to Backend Communication</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={fetchData}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Refresh Data
        </button>
      </div>

      {data && (
        <div>
          <h2>Message from Backend:</h2>
          <p style={{ fontSize: "18px", color: "green" }}>{data.message}</p>

          <h3>Users:</h3>
          <ul>
            {data.data.users.map((user) => (
              <li key={user.id}>
                <strong>{user.name}</strong> - {user.email}
              </li>
            ))}
          </ul>

          <h3>Products:</h3>
          <ul>
            {data.data.products.map((product) => (
              <li key={product.id}>
                <strong>{product.name}</strong> - ${product.price}
              </li>
            ))}
          </ul>

          <p style={{ marginTop: "20px", fontSize: "14px", color: "gray" }}>
            Data fetched at: {data.timestamp}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
