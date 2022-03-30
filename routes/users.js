const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Trip = require("../models/Trip");

router.post("/", async (req, res, next) => {
  const user = await User.create(req.body);
  return res.status(200).json(user);
});

router.get("/:id/trips", async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User is not found" });
  }
  const trips = await Trip.find({ _id: { $in: [user.trips] } });
  return res.status(200).json(trips);
});

router.get("/:id", async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User is not found" });
  }
  return res.status(200).json(user);
});

router.patch("/:id", (req, res, next) => {
  // TO DO: Add functionality to be able to update more than one key at a time.
  User.findByIdAndUpdate(
    { _id: req.params.id },
    { [req.body.key]: req.body.value },
    {},
    (error, updatedUser) => {
      if (error) {
        return res.status(500).json({ error });
      }
      return res
        .status(200)
        .json({ message: "Successfully saved user update", updatedUser });
    }
  );
});

router.delete("/:id", (req, res, next) => {
  // TO DO: Add functionality to delete the user from all trips as well.
  User.findByIdAndDelete(req.params.id, (error, deletedUser) => {
    if (error) {
      return res.status(500).json({ error });
    }
    return res
      .status(200)
      .json({ message: "Successfully deleted the user", deletedUser });
  });
});

module.exports = router;
