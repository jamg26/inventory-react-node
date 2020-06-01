const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const LogSchema = new Schema({
  log_content: String,
  collection_name: String,
  content: Object,
  created_at: Date,
  updated_at: Date,
});
LogSchema.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

mongoose.model("logs", LogSchema);
