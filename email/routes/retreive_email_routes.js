const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const axios = require("axios");
var Imap = require("imap"),
  inspect = require("util").inspect;
var fs = require("fs"),
  fileStream;
const simpleParser = require("mailparser").simpleParser;
module.exports = (app) => {
  app.post(keys.sub + "/retrieve", async (req, res) => {
    const { selected, g_account_password, send_through_email } = req.body;

    var imap = new Imap({
      user: send_through_email,
      password: g_account_password,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: { servername: "imap.gmail.com" },
    });
    let content = [];
    function openInbox(cb) {
      imap.openBox("INBOX", true, cb);
    }
    imap.once("ready", function () {
      openInbox(function (err, box) {
        if (err) {
          res.status(400).send({ status: "ERROR", message: err });
          throw err;
        }
        imap.search([selected, ["SINCE", "JUNE 10, 2020"]], function (
          err,
          results
        ) {
          try {
            if (results.length != 0) {
              if (err) {
                res.status(400).send({ status: "ERROR", message: err });
                throw err;
              }
              var f = imap.fetch(results, {
                bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
                struct: true,
              });
              f.on("message", function (msg, seqno) {
                console.log("Message #%d", seqno);
                var prefix = "(#" + seqno + ") ";
                var body = "",
                  header = "",
                  parsedMsg = {};
                let email_content = [];
                msg.on("body", function (stream, info) {
                  console.log(prefix + "Body");
                  simpleParser(stream, (err, mail) => {
                    email_content.push({
                      date: mail.date,
                      id: mail.references,
                      subject: mail.subject,
                      text: mail.text,
                      html: mail.textAsHtml,
                      from: mail.from,
                      to: mail.to,
                    });
                  });
                  // stream.pipe(fs.createWriteStream("msg-" + seqno + "-body.txt"));
                });
                msg.once("attributes", function (attrs) {
                  console.log(
                    prefix + "Attributes: %s",
                    inspect(attrs, false, 8)
                  );
                });
                msg.once("error", function (err) {
                  console.log("Fetch error: " + err);
                  res.status(400).send({ status: "ERROR", message: err });
                });
                msg.once("end", function () {
                  content.push(email_content);
                  console.log(prefix + "Finished");
                });
              });
              f.once("error", function (err) {
                console.log("Fetch error: " + err);
                res.status(400).send({ status: "ERROR", message: err });
              });
              f.once("end", function () {
                console.log("Done fetching all messages!");
                imap.end();
              });
            } else {
              res
                .status(400)
                .send({ status: "ERROR", message: "No Email Found" });
            }
          } catch (error) {
            res.status(400).send({ status: "ERROR", message: error });
          }
        });
      });
    });

    imap.once("error", function (err) {
      console.log(err);
      res.status(400).send({ status: "ERROR", message: err });
    });

    imap.once("end", function () {
      res.send({ content: content });
      console.log("Connection ended");
    });

    imap.connect();
  });
};

//https://support.google.com/accounts/answer/185833
