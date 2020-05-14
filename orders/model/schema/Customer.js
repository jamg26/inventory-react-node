const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const customer_timeline = new Schema({
  timestamp: {
    type: Date,
  },
  log_text: {
    type: String,
  },
  created_at: Date,
  updated_at: Date,
});
const CustomerShema = new Schema({
  fname: String,
  lname: String,
  company_id: [{ type: Schema.Types.ObjectId, ref: "companies" }],
  company_name: String,
  country: String,
  email: String,
  phone: String,
  company: String,
  address: String,
  landmarks: String,
  city: String,
  postal_code: String,
  use_address_as_shipping_address: {
    type: Boolean,
    default: true,
  },
  tags: Array,
  active: {
    type: Boolean,
    default: true,
  },
  email_verified_at: Date,
  password: String,
  login_token: {
    type: String,
    default: null,
  },
  note: String,
  customer_timeline: [customer_timeline],
  created_at: Date,
  updated_at: Date,
});
CustomerShema.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});
customer_timeline.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

mongoose.model("customers", CustomerShema);
