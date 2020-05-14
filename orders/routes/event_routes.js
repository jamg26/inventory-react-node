const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//models
const products = mongoose.model("products");
module.exports = (app) => {
  app.post(keys.sub + "/events", (req, res) => {
    const { type, data } = req.body;
    console.log("Received Event", type);
    if (type == "UPDATE_PRODUCT_QUANTITY") {
      //get products
      //modify quantity
    }
    res.send({});
  });
};
