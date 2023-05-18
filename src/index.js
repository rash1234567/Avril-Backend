require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use("/api", authRoutes);

mongoose
  .connect(process.env.DB_Url)
  .then(() => console.log("connected to mongoDb"))
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => console.log("could not connect", err));
