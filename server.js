// server.js
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Server is running on Render!");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from your Node.js API on Render!" });
});

// Add this route:
app.get("/trace/:username", (req, res) => {
  const username = req.params.username;
  // For now, just send back username as a test
  res.json({
    message: `Tracing TikTok user: ${username}`,
    username: username,
    status: "success",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
