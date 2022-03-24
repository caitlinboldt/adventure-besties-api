const serverless = require("serverless-http");
const express = require("express");
require("dotenv").config({ path: "./.env" });
const connectToDatabase = require("./database");
const Trip = require("./models/Trip");

const app = express();
app.use(express.json());
connectToDatabase();

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/trips", async (req, res, next) => {
  const trips = await Trip.find();
  return res.status(200).json(trips);
});

app.post("/trip", async (req, res, next) => {
  const trip = await Trip.create(req.body);
  return res.status(200).json(trip);
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
