const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db.js");

const issueRoutes = require("./routes/issueRoutes.js");
const authRoutes = require("./routes/authRoutes.js");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// DB
connectDB();

// routes
app.use("/api/issues", issueRoutes);
app.use("/api/auth", authRoutes);

// test route
app.get("/hello", (req, res) => {
  res.send("Server working");
});

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});