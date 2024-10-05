// server.js
import dotenv from "dotenv"; // Load environment variables from .env
import express from "express"; //
import { GetVisitInfo } from "./CalenedarAPI/GetVisitInfoV2.js";
import { ArrangeData } from "./Patient/patient.js";
import cors from "cors";
const app = express();
dotenv.config();

// require('dotenv').config(); // Load environment variables from .env

// Environment variables from .env file
const { APP_NAME, APP_SECRET, APP_KEY } = process.env;

// Example method that fetches data based on caregiverId
app.use(cors());

// API route that takes a caregiverId as a parameter
app.get("/api/caregiver/:month/:caregiverId/", async (req, res) => {
  const caregiverId = req?.params?.caregiverId;
  const month = req?.params?.month;
  console.log(month);

  // Input validation
  if (!caregiverId) {
    return res.status(400).json({ error: "Invalid or missing caregiverId." });
  }

  // Check if the month is a valid string (you may want to format this further)
  const monthRegex = /^\d{4}-\d{1,2}-\d{1,2}$/; // Example format: "2024-09"
  if (!month || !monthRegex.test(month)) {
    return res
      .status(400)
      .json({ error: "Invalid or missing month. Format should be YYYY-MM." });
  }

  try {
    // Call the method to get the visit information
    const caregiverData = await GetVisitInfo(caregiverId, month);

    // If no data is found, handle it gracefully
    if (!caregiverData || caregiverData.length === 0) {
      return res
        .status(404)
        .json({ error: "No data found for the given caregiverId and month." });
    }

    // Return the data as JSON
    // console.log(caregiverData);
    res.status(200).json(caregiverData);
  } catch (error) {
    // Log the error to the server console for debugging
    console.error("Error fetching caregiver data:", error);

    // Return a general error message
    res.status(500).json({
      error:
        "An error occurred while fetching caregiver data. Please try again later.",
    });
  }
});

app.get("/api/patient/:caregiver", async (req, res) => {
  const caregiver = req.params.caregiver;
  try {
    const data = await ArrangeData(caregiver);
    res.json(data);
  } catch (err) {
    res.json(err);
  }
});

// to handle wrong routes

app.use((req, res, next) => {
  res
    .status(404)
    .json({ error: "Route not found. Please check the URL and try again." });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
