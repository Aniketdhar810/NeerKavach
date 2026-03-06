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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel
module.exports = app;