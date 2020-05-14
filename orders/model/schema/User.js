const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  name: String,
  username: String,
  email: String,
  position: String,
  email_verified_at: Date,
  password: String,
  company_id: [{ type: Schema.Types.ObjectId, ref: "companies" }],
  approved_status: {
    type: Boolean,
    default: true,
  },
  login_token: {
    type: String,
    default: null,
  },
  created_at: Date,
  updated_at: Date,
});
UserSchema.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

mongoose.model("users", UserSchema);
