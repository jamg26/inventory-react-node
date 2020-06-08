const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const SupplierSchema = new Schema({
  company_name: String,
  supplier_code: String,
  display_name: String,
  address: String,
  email: String,
  company_id: [{ type: Schema.Types.ObjectId, ref: "companies" }],
  goods_type: String,
  site_url: String,
  note: String,
  active: {
    type: Boolean,
    default: true,
  },
  created_at: Date,
  updated_at: Date,
});
SupplierSchema.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

mongoose.model("suppliers", SupplierSchema);
