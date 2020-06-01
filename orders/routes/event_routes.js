const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//models
const products = mongoose.model("products");
module.exports = (app) => {
  app.post(keys.sub + "/upload", (req, res) => {
    console.log(req);
    res.send("");
  });
};
