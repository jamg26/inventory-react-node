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
  email: String,
  phone: String,
  company: String,
  address: String,
  landmarks: String,
  street: String,
  city: String,
  country: String,
  postal_code: String,
  username: String,
  gender: {
    type: String,
    default: "Not Specified",
  },
  birthdate: Date,
  use_address_as_shipping_address: {
    type: Boolean,
    default: true,
  },
  tags: Array,
  active: {
    type: Boolean,
    default: true,
  },
  visited_once: {
    type: Boolean,
    default: false,
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
