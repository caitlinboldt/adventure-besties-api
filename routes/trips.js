const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");
const User = require("../models/User");

// Middleware that is specific to this router.
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

router.post("/", async (req, res, next) => {
  const trip = await Trip.create(req.body);
  return res.status(200).json(trip);
});

router.get("/:id", async (req, res, next) => {
  const trip = await Trip.findById(reg.params.id);
  if (!trip) {
    return res.status(404).send("Trip is not found");
  }
  return res.status(200).json(trip);
});

router.patch("/:id", async (req, res, next) => {
  const trip = await Trip.findByIdAndUpdate(reg.params.id);
  // TO DO: Update trip data.
  return res.status(200).json(trip);
});

router.delete("/:id", async (req, res, next) => {
  const trip = await Trip.findByIdAndDelete(reg.params.id);
  // TO DO: Delete trip data.
  return res.status(200).json(trip);
});

router.patch("/addUser", async (req, res, next) => {
  // TO DO: Only allow the same id once.
  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    { $push: { trips: req.body.tripId } }
  );
  if (!user) {
    return res.status(404).send("User is not found");
  }
  await Trip.findOneAndUpdate(
    { _id: req.body.tripId },
    { $push: { users: user._id } }
  );
  return res.status(200).json("Success, the user has been added to the trip");
});

module.exports = router;
