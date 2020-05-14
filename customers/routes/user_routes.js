const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const users = mongoose.model("users");
module.exports = (app) => {
  app.get(keys.sub + "/users", async (req, res) => {
    const request = req.query;
    const result = await users
      .find({})
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.send(err);
      });
  });
};
