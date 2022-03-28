const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Middleware that is specific to this router.
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

router.post("/", async (req, res, next) => {
  const user = await User.create(req.body);
  return res.status(200).json(user);
});

router.get("/:id/trips", async (req, res, next) => {
  // TO DO: Find all trips for the user.
  const trips = await Trip.find();
  return res.status(200).json(trips);
});

router.get("/:id", async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send("User is not found");
  }
  return res.status(200).json(user);
});

router.patch("/:id", async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send("User is not found");
  }
  // TO DO: Update user data.
  return res.status(200).json(user);
});

router.delete("/:id", async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send("User is not found");
  }
  // TO DO: Delete user data.
  return res.status(200).json(user);
});

module.exports = router;
