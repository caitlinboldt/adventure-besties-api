const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");
const User = require("../models/User");
const upload = require("../middleware/cloudinary");

router.post("/", upload.single("image"), async (req, res, next) => {
  if (req.file) {
    req.body.image_url = req.file.path;
  }

  const trip = await Trip.create({ ...req.body, users: [req.body.user] });
  const user = await User.findOneAndUpdate(
    { _id: req.body.user },
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

// PATCH for single string field.
router.patch("/:id", (req, res, next) => {
  Trip.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    { new: true },
    (error, updatedTrip) => {
      if (error) {
        return res.status(500).send(error);
      }
      return res
        .status(200)
        .json({ message: "Successfully saved trip update", updatedTrip });
    }
  );
});

// PATCH for array of objects field.
router.patch("/:id/add/:property", (req, res, next) => {
  Trip.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { [req.params.property]: req.body } },
    { new: true },
    (error, updatedTrip) => {
      if (error) {
        return res.status(500).send(error);
      }
      return res
        .status(200)
        .json({ message: "Successfully saved trip update", updatedTrip });
    }
  );
});

// PATCH for removing an array of objects field.
router.patch("/:id/remove/:property", (req, res, next) => {
  Trip.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { [req.params.property]: { _id: req.body.itemId } } },
    { new: true },
    (error, updatedTrip) => {
      if (error) {
        return res.status(500).send(error);
      }
      return res
        .status(200)
        .json({ message: "Successfully saved trip update", updatedTrip });
    }
  );
});

router.delete("/:id", async (req, res, next) => {
  const trip = await Trip.findById(req.params.id).populate("users");

  await User.updateMany(
    {
      _id: { $in: trip.users },
    },
    {
      $pullAll: {
        trips: [req.params.id],
      },
    }
  );

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
