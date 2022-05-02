const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  name: String,
  cognito_id: String,
  settings: {
    show_full_name: { type: Boolean },
    show_email: { type: Boolean },
    allow_find_by_email: { type: Boolean },
  },
  trips: [{ type: Schema.Types.ObjectId, ref: "Trip" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
