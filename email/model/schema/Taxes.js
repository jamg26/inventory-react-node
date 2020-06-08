const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const subtaxScema = new Schema({
  name: String,
  rate: Number,
  tax_group_id: String,
  active: {
    type: Boolean,
    default: true,
  },
  created_at: Date,
  updated_at: Date,
});
const TaxesSchema = new Schema({
  tax_group_name: String,
  active: {
    type: Boolean,
    default: true,
  },
  tax_names: [subtaxScema],
  created_at: Date,
  updated_at: Date,
});
TaxesSchema.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});
subtaxScema.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});
mongoose.model("taxes", TaxesSchema);
