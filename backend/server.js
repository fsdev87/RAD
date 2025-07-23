const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./db");

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/UserRoutes"));
app.use("/api/symptoms", require("./routes/SymptomRoutes"));
app.use("/api/prescriptions", require("./routes/PrescriptionRoutes"));

// Default route
app.get("/api/data", (req, res) => {
  res.json({
    users: [{ id: 1, name: "Dr. A" }, { id: 2, name: "Dr. B" }],
    message: "Hello from backend"
  });
});

// Start
const PORT = process.env.PORT || 3000;
app.get("/api/data", (req, res) => {
  res.json({
    message: "Hello from the backend!",
    users: [
      { id: 1, name: "Alice", email: "alice@example.com" },
      { id: 2, name: "Bob", email: "bob@example.com" },
      { id: 3, name: "Charlie", email: "charlie@example.com" },
    ],
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
