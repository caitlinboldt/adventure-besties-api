require("dotenv").config({ path: "./.env" });
const serverless = require("serverless-http");
const express = require("express");
const connectToDatabase = require("./database");
const trips = require("./routes/trips");
const users = require("./routes/users");

const app = express();
app.use(express.json());
connectToDatabase();

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.use("/trip", trips);
app.use("/user", users);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
