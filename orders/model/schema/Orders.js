const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const line_items = new Schema({
  product: Array,
  bundle: Array,
  product_type: {
    type: String,
    default: "Product",
  },
  variant_id: String,
  quantity: String,
  quantity_max: String,
  order_date: Date,
  price: String,
  original_price: String,
  total: String,
  delivery_status: String,
  created_at: Date,
  updated_at: Date,
});
const customer_info = new Schema({
  fname: String,
  lname: String,
  company_name: String,
  address: String,
  email: String,
  phone: String,
  landmarks: String,
  street: String,
  city: String,
  postal_code: String,
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
  customer_info: customer_info,
  order_no: String,
  delivery_method: {
    type: String,
    default: "Standard Delivery",
  },
  order_status: {
    type: String,
    default: "Pending", //pending, processing, for delivery/pick up, cancelled, completed
  },
  order_date: Date,
  delivery_date: Date,
  order_note: String,
  phone: String,
  address: String,
  landmarks: String,
  city: String,
  postal_code: String,
  payment_status: {
    type: String,
    default: "Pending",
  },
  payment_info: Object,
  payment_note: String,
  payment_total: String,
  payment_date: Date,
  check_out_date: Date,
  fulfillment_status: {
    type: String,
    default: "Pending",
  },
  received_by: String,
  delivered_by: String,
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
