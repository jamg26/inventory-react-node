const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const SettingsSchema = new Schema({
  logo: String,
  name: String,
  industry: String,
  type: String,
  location: String,
  streetone: String,
  streettwo: String,
  city: String,
  province: String,
  zipcode: String,
  phone: String,
  fax: String,
  website: String,
  sender_email: String,
  send_through_email: String,
  base_currency: String,
  date_format: String,
  created_at: Date,
  updated_at: Date,
});
SettingsSchema.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

mongoose.model("settings", SettingsSchema);
