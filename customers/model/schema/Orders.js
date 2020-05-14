const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const variants_options = new Schema({
  option_value: String,
  created_at: Date,
  updated_at: Date,
});
const variants = new Schema({
  option_title: String,
  supplier: [{ type: Schema.Types.ObjectId, ref: "suppliers" }],
  supplier_price: String,
  price_with_tax: String,
  price_without_tax: String,
  sku: String,
  price: String,
  images: String,
  discounter_price: String,
  discounted: {
    type: Boolean,
    default: false,
  },
  barcode: String,
  quantity: String,
  brand: String,
  color: String,
  size: String,
  created_at: Date,
  updated_at: Date,
});
const line_items = new Schema({
  product: [{ type: Schema.Types.ObjectId, ref: "products" }],
  quantity: String,
  order_date: Date,
  price: String,
  original_price: String,
  total: String,
  delivery_status: String,
  variants: [variants],
  created_at: Date,
  updated_at: Date,
});
const payment_info = new Schema({
  method: String,
  created_at: Date,
  updated_at: Date,
});
const staff_notes = new Schema({
  staff: [{ type: Schema.Types.ObjectId, ref: "users" }],
  note: String,
  created_at: Date,
  updated_at: Date,
});
const order_logs = new Schema({
  log: String,
  created_at: Date,
  updated_at: Date,
});
const OrderSchema = new Schema({
  customer: [{ type: Schema.Types.ObjectId, ref: "customers" }],
  order_no: String,
  delivery_method: {
    type: String,
    default: "For Delivery",
  },
  order_date: Date,
  order_note: String,
  phone: String,
  address: String,
  landmarks: String,
  city: String,
  postal_code: String,
  payment_status: String,
  payment_info: String,
  payment_note: String,
  payment_total: String,
  fulfillment_status: String,
  bagger: [{ type: Schema.Types.ObjectId, ref: "users" }],
  checker: [{ type: Schema.Types.ObjectId, ref: "users" }],
  releaser: [{ type: Schema.Types.ObjectId, ref: "users" }],
  driver: [{ type: Schema.Types.ObjectId, ref: "users" }],
  supervisor: [{ type: Schema.Types.ObjectId, ref: "users" }],
  line_item: [line_items],
  staff_note: [staff_notes],
  order_log: [order_logs],
  active: {
    type: Boolean,
    default: false,
  },
  ip_address: String,
  created_at: Date,
  updated_at: Date,
});
variants.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});
variants_options.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});
line_items.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});
order_logs.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});
OrderSchema.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

mongoose.model("orders", OrderSchema);
