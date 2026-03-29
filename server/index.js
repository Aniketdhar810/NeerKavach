const express = require("express");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.CLIENT_URL,
    "https://neer-kavach-4o2v.vercel.app",
    /\.vercel\.app$/
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

require("./passport")(passport);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/prediction", require("./routes/prediction"));
app.use("/api/users", require("./routes/users"));

app.get("/", (req, res) => {
  res.send("Server Running");
});

// Prevent Hugging Face ML API from sleeping by pinging it periodically
const axios = require("axios");
const ML_API_URL = process.env.ML_API_URL;
if (ML_API_URL) {
  setInterval(async () => {
    try {
      // Adjust endpoint as needed for your ML API
      await axios.post(ML_API_URL, { ping: true });
      console.log("Pinged ML API to keep it awake");
    } catch (err) {
      console.error("Failed to ping ML API:", err.message);
    }
  }, 5 * 60 * 1000); // Ping every 5 minutes
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel
module.exports = app;