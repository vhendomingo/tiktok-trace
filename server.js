const express = require("express");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const cors = require("cors");  // add CORS import

const app = express();

app.use(cors());              // enable CORS for all routes
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Server is running on Render!");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from your Node.js API on Render!" });
});

// TikTok trace route with scraping
app.get("/trace/:username", async (req, res) => {
  const username = req.params.username;
  const url = `https://www.tiktok.com/@${username}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      return res.status(404).json({ error: "User not found" });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Example: extract TikTok page title (usually includes user display name)
    const title = $("title").text();

    res.json({
      username,
      title,
      message: "Successfully fetched TikTok user page title",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch TikTok data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
