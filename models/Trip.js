const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  title: String,
  description: String,
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  start_date: Date,
  end_date: Date,
  image_url: String,
  lodging: [
    {
      lodging_type: String,
      location: String,
      cost_per_night: Number,
      nights: Number,
      website_url: String,
    },
  ],
  flights: [
    {
      airline: String,
      airport_from: String,
      airport_to: String,
      flight_number: String,
      departure_time: Date,
      arrival_time: Date,
      cost: Number,
    },
  ],
  car_rental: [
    {
      car_rental_name: String,
      start_date: Date,
      end_date: Date,
      days: Number,
      car_type: String,
      cost: Number,
    },
  ],
  itinerary: [{ day_id: String, details: String }],
  map_pinpoints: [String],
  total_cost: Number,
  updated: { type: Date, default: Date.now },
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
