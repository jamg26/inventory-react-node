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
const mailgun = require("mailgun-js");
var aws = require("aws-sdk");

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
    const {
      to,
      subject,
      text,
      customer_email,
      name,
      customer_id,
      aws_region,
      aws_access_key_id,
      aws_secret_key,
    } = req.body;
    aws.config.update({
      region: aws_region,
      accessKeyId: aws_access_key_id,
      secretAccessKey: aws_secret_key,
    });
    // Instantiate SES.
    var ses = new aws.SES();

    var ses_mail = "From: " + customer_email + "\n"; //email from
    ses_mail = ses_mail + "To: " + to + "\n";
    ses_mail = ses_mail + "Subject: " + subject + "\n"; //subject

    ses_mail = ses_mail + "MIME-Version: 1.0\n";
    ses_mail =
      ses_mail + 'Content-Type: multipart/mixed; boundary="NextPart"\n\n';
    ses_mail = ses_mail + "--NextPart\n";
    ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
    ses_mail = ses_mail + text + "\n\n"; //email body
    ses_mail = ses_mail + "--NextPart\n";
    ses_mail = ses_mail + "Content-Type: text/plain;\n";
    // ses_mail =
    //   ses_mail + 'Content-Disposition: attachment; filename="attachment.txt"\n\n'; //attachment
    // ses_mail =
    //   ses_mail + "AWS Tutorial Series - Really cool file attachment!" + "\n\n"; //attachment content
    // ses_mail = ses_mail + "--NextPart--";

    var params = {
      RawMessage: { Data: new Buffer(ses_mail) },
      Destinations: [to],
      Source: customer_email,
    };

    ses.sendRawEmail(params, async (err, data) => {
      if (err) {
        res.status(400).send({ status: "ERROR", message: err.message });
      } else {
        console.log(err, data);
        const e = new emails({
          sender_email: customer_email,
          sender_message: text,
          customer_id: customer_id,
        });
        await e.save();
        res.send({ status: "OK", message: "successfully sent an email" });
      }
    });
    // const mg = mailgun({ apiKey: keys.api_key, domain: keys.domain });
    // const data = {
    //   from: customer_email,
    //   to: to,
    //   subject: subject,
    //   text: text,
    //   html: text,
    // };
    // mg.messages().send(data, async (error, body) => {
    //   console.log(error, body);
    //   const e = new emails({
    //     sender_email: customer_email,
    //     sender_message: text,
    //     customer_id: customer_id,
    //   });
    //   await e.save();
    //   res.send({ status: "OK", message: "successfully sent an email" });
    // });
  });
  app.post(keys.sub + "/admin_send", async (req, res) => {
    const {
      cc,
      send_to,
      sender,
      subject,
      text,
      reply_to,
      aws_region,
      aws_access_key_id,
      aws_secret_key,
    } = req.body;
    aws.config.update({
      region: aws_region,
      accessKeyId: aws_access_key_id,
      secretAccessKey: aws_secret_key,
    });
    // Instantiate SES.
    var ses = new aws.SES();

    var ses_mail = "From: " + sender + "\n"; //email from
    ses_mail = ses_mail + "To: " + send_to + "\n";
    ses_mail = ses_mail + "Subject: " + subject + "\n"; //subject
    ses_mail = ses_mail + "Cc: " + cc + "\n"; //cc
    if (reply_to) {
      ses_mail = ses_mail + "Reply-To: " + reply_to + "\n"; //cc
    }

    ses_mail = ses_mail + "MIME-Version: 1.0\n";
    ses_mail =
      ses_mail + 'Content-Type: multipart/mixed; boundary="NextPart"\n\n';
    ses_mail = ses_mail + "--NextPart\n";
    ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
    ses_mail = ses_mail + text + "\n\n"; //email body
    ses_mail = ses_mail + "--NextPart\n";
    ses_mail = ses_mail + "Content-Type: text/plain;\n";
    // ses_mail =
    //   ses_mail + 'Content-Disposition: attachment; filename="attachment.txt"\n\n'; //attachment
    // ses_mail =
    //   ses_mail + "AWS Tutorial Series - Really cool file attachment!" + "\n\n"; //attachment content
    // ses_mail = ses_mail + "--NextPart--";

    var params = {
      RawMessage: { Data: new Buffer(ses_mail) },
      Destinations: [send_to],
      Source: sender,
    };

    ses.sendRawEmail(params, function (err, data) {
      if (err) {
        res.status(400).send({ status: "ERROR", message: err.message });
      } else {
        res.send({ status: "OK", message: "successfully sent an email" });
      }
    });

    // const mg = mailgun({ apiKey: keys.api_key, domain: keys.domain });
    // let data = {
    //   from: sender,
    //   to: send_to,
    //   cc: cc,
    //   subject: subject,
    //   text: text,
    //   html: text,
    // };
    // if (cc == "") {
    //   data = {
    //     from: sender,
    //     to: send_to,
    //     subject: subject,
    //     text: text,
    //     html: text,
    //     "h:Reply-To": "ceciliodeticio13@gmail.com",
    //   };
    // } else {
    //   data = {
    //     from: sender,
    //     to: send_to,
    //     cc: cc,
    //     subject: subject,
    //     text: text,
    //     html: text,
    //   };
    // }
    // // console.log(mg.);
    // mg.messages().send(data, async (error, body) => {
    //   console.log(error, body);
    //   if (error) {
    //     res.status(400).send({ status: "ERROR", message: error.message });
    //   } else {
    //     res.send({ status: "OK", message: "successfully sent an email" });
    //   }
    // });
  });
};
