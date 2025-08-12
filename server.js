const express = require("express");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Server is running on Render!");
});

// TikTok trace route with scraping user stats
app.get("/trace/:username", async (req, res) => {
  const username = req.params.username;
  const url = `https://www.tiktok.com/@${username}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      return res.status(404).json({ error: "User not found" });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract JSON from <script id="SIGI_STATE" type="application/json">
    const sigiScript = $("#SIGI_STATE").html();

    if (!sigiScript) {
      return res.status(500).json({ error: "Could not find user data script" });
    }

    const sigiData = JSON.parse(sigiScript);

    // Navigate to user info in JSON
    // User info is inside: sigiData.UserModule.users[username]
    const userInfo = sigiData?.UserModule?.users?.[username];
    const userStats = sigiData?.UserModule?.stats?.[username];

    if (!userInfo || !userStats) {
      return res.status(404).json({ error: "User data not found in page" });
    }

    // Prepare response
    const data = {
      username: userInfo.uniqueId,
      display_name: userInfo.nickname,
      bio: userInfo.signature,
      followers: userStats.followerCount,
      likes: userStats.heartCount,
      videos: userStats.videoCount,
      verified: userInfo.verified,
      avatar: userInfo.avatarLarger,
      location: "Unknown", // TikTok doesn't provide location in this JSON
      fetched_at: new Date().toISOString(),
    };

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch TikTok data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
