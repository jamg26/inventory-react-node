const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const po_items = new Schema({
  product: [{ type: Schema.Types.ObjectId, ref: "products" }],

  bill_to: String,
  ship_to: String,
  delivery_due_date: Date,
  quantity: String,
  item_cost: String,
  tax: String,
  total: String,
  created_at: Date,
  updated_at: Date,
});
const POSchema = new Schema({
  po_no: String,
  invoice_no: String,
  supplier_note: String,
  total: String,
  supplier: [{ type: Schema.Types.ObjectId, ref: "suppliers" }],
  stock_source: String,
  entry_by: [{ type: Schema.Types.ObjectId, ref: "users" }],
  received_by: [{ type: Schema.Types.ObjectId, ref: "users" }],
  due_date: Date,
  received: {
    type: Boolean,
    default: false,
  },
  type: String,
  po_items: [po_items],
  status: {
    type: String,
    default: "Open",
  },
  created_at: Date,
  updated_at: Date,
});
POSchema.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});
po_items.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});
mongoose.model("purchase_orders", POSchema);
