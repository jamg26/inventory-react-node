const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const logs = new Schema({
  log: String,
  created_at: Date,
  updated_at: Date,
});
const variants = new Schema({
  option_title: String,
  supplier: [{ type: Schema.Types.ObjectId, ref: "suppliers" }],
  // supplier: Object,
  supplier_price: String,
  price_with_tax: String,
  price_without_tax: String,
  sku: String,
  markup: String,
  price: String,
  images: String,
  discounter_price: String,
  discounted: {
    type: Boolean,
    default: false,
  },
  reorder_point: {
    type: Number,
    default: 10,
  },
  reorder_amount: {
    type: Number,
    default: 1,
  },
  barcode: String,
  quantity: String,
  brand: String,
  color: String,
  size: String,
  active: {
    type: Boolean,
    default: true,
  },
  logs: [logs],
  created_at: Date,
  updated_at: Date,
});
const product_tags = new Schema({
  tag_label: String,
  created_at: Date,
  updated_at: Date,
});
const ProductSchema = new Schema({
  product_name: String,
  product_description: String,
  product_type: [{ type: Schema.Types.ObjectId, ref: "product_types" }],
  product_tags: [product_tags],
  active: {
    type: Boolean,
    default: true,
  },
  variants: [variants], //should always have atleast one variant
  created_at: Date,
  updated_at: Date,
});
product_tags.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});
variants.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});
logs.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});
ProductSchema.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

mongoose.model("products", ProductSchema);
