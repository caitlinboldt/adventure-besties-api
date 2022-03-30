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
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    return res.status(404).send("Trip is not found");
  }
  return res.status(200).json(trip);
});

router.patch("/:id", async (req, res, next) => {
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

router.delete("/:id", async (req, res, next) => {
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
    return res.status(404).send("User is not found");
  }
  await Trip.findOneAndUpdate(
    { _id: req.body.tripId },
    { $addToSet: { users: user._id } }
  );
  return res.status(200).json("Success, the user has been added to the trip");
});

module.exports = router;
