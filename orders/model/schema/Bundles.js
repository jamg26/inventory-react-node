const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const product_tags = new Schema({
  tag_label: String,
  created_at: Date,
  updated_at: Date,
});
const bundle_items = new Schema({
  key: String,
  parent_id: String,
  variant_id: String,
  variant_name: String,
  variant_image: String,
  variant_sku: String,
  variant_supplier_price: Number,
  variant_markup: Number,
  variant_price_without_tax: Number,
  variant_price_with_tax: Number,
  variant_price: Number,
  variant_quantity: Number,
  variant_quantity_max: Number,
  active: {
    type: Boolean,
    default: true,
  },
  product_name: String,
  product_description: String,
  product_brand: String,
  product_tags: [],
  product_type: String,
  product_supplier: String,
  created_at: Date,
  updated_at: Date,
});
const BundleSchema = new Schema({
  name: String,
  description: String,
  product_type: [{ type: Schema.Types.ObjectId, ref: "product_types" }],
  product_tags: [product_tags],
  image: String,
  brand: String,
  supplier: String,
  supplier_code: String,
  sku: String,
  barcode: String,
  initial_stock: String,
  product_selection: {
    type: Boolean,
    default: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  bundle_items: [bundle_items],
  bundle_price: Number,
  created_at: Date,
  updated_at: Date,
});
BundleSchema.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});
bundle_items.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});
product_tags.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});
mongoose.model("bundles", BundleSchema);
