import dotenv from "dotenv";
import express from "express";
import { createClient } from "redis";
import asyncHandler from "express-async-handler";
import { GetVisitInfo } from "./CalenedarAPI/GetVisitInfoV2.js";

dotenv.config();

const app = express();
const { APP_NAME, APP_SECRET, APP_KEY, REDIS_URL } = process.env;

// Create Redis client
const redisClient = createClient({ url: REDIS_URL });
redisClient.on("error", (err) => console.log("Redis Client Error", err));
await redisClient.connect();

// Rate limiting middleware
const rateLimiter = asyncHandler(async (req, res, next) => {
  const caregiverId = req.params.caregiverId;
  const requestCount = await redisClient.incr(`rateLimit:${caregiverId}`);

  if (requestCount === 1) {
    await redisClient.expire(`rateLimit:${caregiverId}`, 3600); // 1 hour in seconds
  }

  if (requestCount > 100) {
    res.status(429).json({
      error: "Rate limit exceeded. Try again later.",
    });
    return;
  }

  res.setHeader("X-RateLimit-Limit", 100);
  res.setHeader("X-RateLimit-Remaining", Math.max(0, 100 - requestCount));

  next();
});

// Home route
app.get("/", (req, res) => res.json("You are on the home page"));

// Caregiver route with rate limiting
app.get(
  "/api/caregiver/:caregiverId/",
  rateLimiter,
  asyncHandler(async (req, res) => {
    const caregiverId = req.params.caregiverId;
    console.log(req.params);
    try {
      const caregiverData = await GetVisitInfo(caregiverId);
      res.json(caregiverData);
    } catch {
      res.status(400).json({ error: "Problem retriving visits Information" });
    }
  })
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await redisClient.quit();
  process.exit(0);
});
