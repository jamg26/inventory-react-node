const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const CompanySchema = new Schema({
  customer_id: [{ type: Schema.Types.ObjectId, ref: "customers" }],
  not_new: {
    type: Boolean,
    default: false,
  },
  created_at: Date,
  updated_at: Date,
});
CompanySchema.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

mongoose.model("customers_login_logs", CompanySchema);
