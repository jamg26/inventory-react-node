const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const EmailSchema = new Schema({
  sender_email: String,
  sender_message: String,
  customer_id: String,
  created_at: Date,
  updated_at: Date,
});
EmailSchema.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

mongoose.model("emails", EmailSchema);
