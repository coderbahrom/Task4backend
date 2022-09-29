const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const User = require("./models/users");
const users = require("./routes/users");
const cors = require("cors");
app.use(express.json());
dotenv.config();
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Error connecting to database");
  });
app.use(cors());
app.use(users);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
