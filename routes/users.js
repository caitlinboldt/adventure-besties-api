const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Trip = require("../models/Trip");

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
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send("User is not found");
  }
  const userTrips = user.trips;
  if (userTrips.length < 1) {
    return res.status(404).send("This user does not have any trips");
  }
  const trips = await Trip.find({ _id: { $in: [user.trips] } });
  if (!trips) {
    return res.status(404).send("No matching trips were found for this user");
  }
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

router.delete("/:id", async (req, res, next) => {
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
