// server.js
import dotenv from "dotenv"; // Load environment variables from .env
import express from "express"; //
import { GetVisitInfo } from "./CalenedarAPI/GetVisitInfoV2.js";
import cors from "cors";
const app = express();
dotenv.config();

// require('dotenv').config(); // Load environment variables from .env

// Environment variables from .env file
const { APP_NAME, APP_SECRET, APP_KEY } = process.env;

// Example method that fetches data based on caregiverId
app.use(cors());

// API route that takes a caregiverId as a parameter
app.get("/api/caregiver/:caregiverId/", async (req, res) => {
  const caregiverId = req.params.caregiverId;

  try {
    // Run a method using the caregiverId
    const caregiverData = await GetVisitInfo(caregiverId);

    // Return the data as JSON
    res.json(caregiverData);
  } catch (error) {
    // Catch and return any errors from the getCaregiverData method
    res.status(400).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
