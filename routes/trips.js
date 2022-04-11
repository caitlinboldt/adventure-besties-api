const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");
const User = require("../models/User");

router.post("/", async (req, res, next) => {
  const trip = await Trip.create(req.body);
  const user = await User.findOneAndUpdate(
    { _id: req.body.users[0] },
    { $addToSet: { trips: trip._id } }
  );
  if (!user) {
    return res.status(404).json({ message: "User is not found" });
  }
  return res.status(200).json(trip);
});

router.get("/:id", async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    return res.status(404).json({ message: "Trip is not found" });
  }
  return res.status(200).json(trip);
});

router.patch("/:id", (req, res, next) => {
  // TO DO: Add functionality to be able to update more than one key at a time.
  Trip.findOneAndUpdate(
    { _id: req.params.id },
    { [req.body.key]: req.body.value },
    {},
    (error, updatedTrip) => {
      if (error) {
        return res.status(500).json({ error });
      }
      return res
        .status(200)
        .json({ message: "Successfully saved trip update", updatedTrip });
    }
  );
});

router.delete("/:id", (req, res, next) => {
  // TO DO: Add functionality to delete the trip from all users as well.
  Trip.findByIdAndDelete(req.params.id, (error, deletedTrip) => {
    if (error) {
      return res.status(500).json({ error });
    }
    return res
      .status(200)
      .json({ message: "Successfully deleted the trip", deletedTrip });
  });
});

router.patch("/new/addUser", async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    { $addToSet: { trips: req.body.tripId } }
  );
  if (!user) {
    return res.status(404).json({ message: "User is not found" });
  }
  await Trip.findOneAndUpdate(
    { _id: req.body.tripId },
    { $addToSet: { users: user._id } }
  );
  return res
    .status(200)
    .json({ message: "Success, the user has been added to the trip" });
});

module.exports = router;
