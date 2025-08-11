// server.js
const express = require("express");
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Server is running on Render!");
});

// Example API route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from your Node.js API on Render!" });
});

// Use Render's assigned PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
