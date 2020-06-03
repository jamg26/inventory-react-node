const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const axios = require("axios");
//models
const orders = mongoose.model("orders");
const products = mongoose.model("products");
const product_types = mongoose.model("product_types");
function checkAuth(req, res, next) {
  const { login_token } = req.body;
  console.log(login_token);
  if (login_token != "") {
    next();
  } else {
    res
      .status(401)
      .send({ status: "unautorized", message: "User not Authorized" });
  }
}
module.exports = (app) => {
  app.get(keys.sub + "/", async (req, res) => {
    res.send("order server");
  });
  app.get(keys.sub + "/customer_cart/:id", async (req, res) => {
    const request = req.params;
    const cart = await orders.findOne({ customer: request.id, active: false });
    res.send({ cart });
  });
  app.get(keys.sub + "/get_categories", async (req, res) => {
    const product_types_list = await product_types.find({
      product_type_active: true,
    });
    res.send({ product_types_list });
  });
  app.get(
    keys.sub + "/customer_order_history/:id",

    async (req, res) => {
      const request = req.params;
      const cart = await orders
        .find({ customer: request.id, active: true })
        .sort({ order_date: -1 })
        .populate("bagger")
        .populate("checker")
        .populate("releaser")
        .populate("driver")
        .populate("supervisor")
        .populate("customer");
      res.send({ cart });
    }
  );

  app.get(keys.sub + "/abandoned_orders", async (req, res) => {
    const request = req.query;
    const result = await orders
      .find({ active: false })
      .populate("bagger")
      .populate("checker")
      .populate("releaser")
      .populate("driver")
      .populate("supervisor")
      .populate("customer");
    res.send(result);
  });
  app.get(keys.sub + "/orders", async (req, res) => {
    const request = req.query;
    const result = await orders
      .find({ active: true })
      .populate("bagger")
      .populate("checker")
      .populate("releaser")
      .populate("driver")
      .populate("supervisor")
      .populate("customer");
    res.send(result);
  });
  app.get(keys.sub + "/all_orders", async (req, res) => {
    const request = req.query;
    const result = await orders
      .find({ active: true })
      .populate("bagger")
      .populate("checker")
      .populate("releaser")
      .populate("driver")
      .populate("supervisor")
      .populate("customer");
    res.send(result);
  });
  app.post(keys.sub + "/order_by_customer", async (req, res) => {
    const request = req.body;
    const result = await orders
      .find({ customer: request.id })
      .sort({ order_date: -1 })
      .populate("bagger")
      .populate("checker")
      .populate("releaser")
      .populate("driver")
      .populate("supervisor")
      .populate("customer");
    res.send(result);
  });
  app.post(keys.sub + "/order_by_id", async (req, res) => {
    const request = req.body;
    const result = await orders
      .find({ _id: request.id })
      .populate("bagger")
      .populate("checker")
      .populate("releaser")
      .populate("driver")
      .populate("supervisor")
      .populate("customer");
    res.send(result);
  });
};
