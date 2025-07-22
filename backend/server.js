const express = require("express");
const cors = require("cors");
const app = express();

// Enable CORS for all routes
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Dummy API endpoint
app.get("/api/data", (req, res) => {
  res.json({
    message: "Hello from the backend!",
    data: {
      users: [
        { id: 1, name: "Alice", email: "alice@example.com" },
        { id: 2, name: "Bob", email: "bob@example.com" },
        { id: 3, name: "Charlie", email: "charlie@example.com" },
      ],
      products: [
        { id: 1, name: "Laptop", price: 999.99 },
        { id: 2, name: "Mouse", price: 29.99 },
        { id: 3, name: "Keyboard", price: 79.99 },
      ],
    },
    timestamp: new Date().toISOString(),
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
