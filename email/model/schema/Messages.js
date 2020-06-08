const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const MessageSchema = new Schema({
  user: String,
  room: String,
  customer_id: String,
  client: String,
  text: String,
  seen: {
    type: Boolean,
    default: false,
  },
  created_at: Date,
  updated_at: Date,
});
MessageSchema.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

mongoose.model("messages", MessageSchema);
