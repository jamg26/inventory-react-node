const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const POSchema = new Schema({
  po_no: String,
  invoice_no: String,
  supplier_note: String,
  total: String,
  product: [{ type: Schema.Types.ObjectId, ref: "products" }],
  variant: String,
  bill_to: String,
  ship_to: String,
  delivery_due_date: Date,
  quantity: String,
  item_cost: String,
  tax: String,
  supplier: [{ type: Schema.Types.ObjectId, ref: "suppliers" }],
  stock_source: String,

  received_by: [{ type: Schema.Types.ObjectId, ref: "users" }],
  received: {
    type: Boolean,
    default: false,
  },
  entry_by: [{ type: Schema.Types.ObjectId, ref: "users" }],
  type: String,
  status: {
    type: String,
    default: "Open",
  },
  transfer_name: String,
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

mongoose.model("purchase_orders", POSchema);
