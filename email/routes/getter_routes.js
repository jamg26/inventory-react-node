const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const axios = require("axios");
var Mailgun = require("mailgun-js");
//models
const orders = mongoose.model("orders");
const products = mongoose.model("products");
const product_types = mongoose.model("product_types");
const settings = mongoose.model("settings");
const taxes = mongoose.model("taxes");
const messaging = mongoose.model("messages");
var api_key = "e3de81e59bc637b41d01c148313f78bd-8b34de1b-5c4ef5dc";
var domain = "sandboxc5a36f98c7024f4191f21419c878e1d1.mailgun.org";
var from_who = "";
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
  //Do something when you're landing on the first page
  app.get(keys.sub + "/change_env", (req, res) => {
    process.env.EMAIL = "process_env@gmail.com";
    res.send({ status: "OK", email: process.env.EMAIL });
  });
  app.get(keys.sub + "/", function (req, res) {
    //render the index.jade file - input forms for humans
    res.render("index-page", function (err, html) {
      if (err) {
        // log any error to the console for debug
        console.log(err);
      } else {
        //no error, so send the html to the browser
        res.send(html);
      }
    });
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
