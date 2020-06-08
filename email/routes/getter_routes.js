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
const messaging = mongoose.model("messages");
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
    res.send("email server");
  });

  app.post(keys.sub + "/get_client_messages", async (req, res) => {
    const { client_id } = req.body;
    // const mes = await messaging.find({ client: client_id }).then((messages) => {
    //   res.send({ messages });
    // });
    const mes = await messaging
      .aggregate([
        {
          $match: {
            client: client_id,
          },
        },
        {
          $project: {
            _id: "$room",
            user: "$user",
            customer_id: "$customer_id",
            client: "$client",
            PosSentiment: {
              $cond: [{ $ne: ["$seen", true] }, 1, 0],
            },
          },
        },
        {
          $group: {
            _id: "$room",
            user: {
              $first: "$user",
            },
            customer_id: {
              $first: "$customer_id",
            },
            client: {
              $first: "$client",
            },
            unseen: {
              $sum: "$PosSentiment",
            },
          },
        },
      ])
      .then((messages) => {
        res.send({ messages });
      });
  });
  app.post(keys.sub + "/get_chat_history", async (req, res) => {
    const { room } = req.body;
    const mes = await messaging.find({ room: room }).then((messages) => {
      res.send({ messages });
    });
  });
};
