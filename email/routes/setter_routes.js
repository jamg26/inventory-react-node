const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const axios = require("axios");
//models
const orders = mongoose.model("orders");
const products = mongoose.model("products");
const settings = mongoose.model("settings");
const taxes = mongoose.model("taxes");
const emails = mongoose.model("emails");
const messaging = mongoose.model("messages");
const nodemailer = require("nodemailer");
function checkAuth(req, res, next) {
  const { login_token } = req.body;
  if (login_token != "" && login_token != undefined) {
    next();
  } else {
    res
      .status(401)
      .send({ status: "unautorized", message: "User not Authorized" });
  }
}
module.exports = (app) => {
  app.post(keys.sub + "/update_messages_status", async (req, res) => {
    const { client_id, room } = req.body;
    try {
      console.log(client_id, room);

      let sss = await messaging.updateMany(
        {
          room: room,
        },
        {
          seen: true,
        },
        {
          new: true,
        }
      );
    } catch (e) {
      console.log(e);
    }

    res.send(room);
  });
  app.post(keys.sub + "/save_chat_messages", async (req, res) => {
    const { room, customer_id, client, text, user } = req.body;
    console.log(room, customer_id, client, text);
    const m = new messaging({
      user,
      room,
      customer_id,
      client,
      text,
    });
    m.save();
    res.send(room, customer_id, client, text);
  });
  app.post(keys.sub + "/send", async (req, res) => {
    const { to, subject, text, customer_email, name } = req.body;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ecomemailbot@gmail.com",
        pass: ":{HF(AY+Z[h4D6sv",
      },
    });
    var mailOptions = {
      from: "ecomemailbot@gmail.com",
      to: to,
      subject: subject,
      text:
        "Name : " +
        name +
        "\n" +
        "Email : " +
        customer_email +
        "\n" +
        "Message :" +
        text,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        res.status(400).send({ result: error.message });

        res.send({ status: "OK", message: "successfully sent an email" });
        const e = new emails({
          sender_email: customer_email,
          sender_message: text,
          customer_id: String,
        });
        await e.save();
        console.log(error);
      } else {
        res.send({ status: "OK", message: "successfully sent an email" });
        console.log("Email sent: " + info.response);
      }
    });
  });
};
