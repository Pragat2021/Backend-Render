const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb+srv://GeoLoci:asdfghjkl@cluster0.g2gjuhp.mongodb.net/GeoLociDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Location Schema and Model
const locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});

const Location = mongoose.model("Location", locationSchema);

// API to store location data
app.post("/api/location", async (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude && longitude) {
    try {
      const location = new Location({ latitude, longitude });
      await location.save();
      console.log("Location saved:", location);
      res.status(200).send("Location saved successfully!");
    } catch (err) {
      console.error("Error saving location:", err);
      res.status(500).send("Failed to save location.");
    }
  } else {
    res.status(400).send("Invalid location data.");
  }
});

// API to fetch all locations
app.get("/api/locations", async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).send("Failed to fetch locations.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
