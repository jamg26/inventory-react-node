const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//models
const products = mongoose.model("products");
module.exports = (app) => {
  app.get(keys.sub + "/products", async (req, res) => {
    const reponse = await products
      .find({ active: true })
      .populate("product_type")
      .populate("supplier");
    res.send(reponse);
    ("");
  });
};
