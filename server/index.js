const express = require("express");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;


connectDB();

app.use(cors());
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