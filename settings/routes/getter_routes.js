const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const axios = require("axios");
//models
const orders = mongoose.model("orders");
const products = mongoose.model("products");
const product_types = mongoose.model("product_types");
const settings = mongoose.model("settings");
const taxes = mongoose.model("taxes");
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
    res.send("settings server");
  });
  app.get(keys.sub + "/settings", async (req, res) => {
    await settings
      .findOne({})
      .then((setting) => {
        res.send({
          status: "OK",
          message: "",
          data: setting == null ? undefined : setting,
        });
      })
      .catch(() => {
        res.status(400).send({
          status: "ERROR",
          message: "something went wrong!",
          data: undefined,
        });
      });
  });
  app.get(keys.sub + "/taxes", async (req, res) => {
    const tax = await taxes.find({}).sort({ tax_group_name: 1 });
    res.send({
      status: "OK",
      message: "",
      data: tax,
    });
  });
};
