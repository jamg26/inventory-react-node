const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const moment = require("moment");
//models{ customer_timeline: { log_text: "Customer Account Created" } }
const customers = mongoose.model("customers");
const logs = mongoose.model("customers_login_logs");
function send_verification_code(code) {
  var accountSid = "ACd3f86c07cc1e15076c342d9d4ccdabad"; // Your Account SID from www.twilio.com/console
  var authToken = "623897efa937750e5c356037d62613ab"; // Your Auth Token from www.twilio.com/console

  var twilio = require("twilio");
  var client = new twilio(accountSid, authToken);

  client.messages
    .create({
      body: "Your Verification Code is " + code,
      to: "+639998566541", // Text this number
      from: "+12029337079", // From a valid Twilio number
    })
    .then((message) => {
      console.log("SENT", code);
    })
    .catch((err) => {
      console.log("NOT SENT", err);
    });
}
module.exports = (app) => {
  app.post(keys.sub + "/verify_code", async (req, res) => {
    const { _id, code } = req.body;
    const user = await customers
      .findOne({ _id: _id })
      .then(async (user) => {
        if (user == null) {
          res.send({ message: "NO USER FOUND" });
        } else {
          if (code == user.verification_code) {
            user.verification_status = true;
            await user
              .save()
              .then(async (info) => {
                res.send({ token: "", user: info, message: "OK" });
              })
              .catch(() => {
                res.send({ token: "", message: "NO USER FOUND" });
              });
          } else {
            res.send({ token: "", message: "Invalid Validation Code" });
          }
        }
      })
      .catch((err) => {
        res.send({ token: "", message: "ERROR" });
      });
  });
  app.post(keys.sub + "/resend_code", async (req, res) => {
    const { _id } = req.body;
    const user = await customers
      .findOne({ _id: _id })
      .then(async (user) => {
        if (user == null) {
          res.send({ message: "NO USER FOUND" });
        } else {
          let code = Math.floor(Math.random() * (99999 - 10000)) + 10000;
          user.verification_code = code;
          await user
            .save()
            .then(async (info) => {
              send_verification_code(code);
              res.send({ token: "", user: info, message: "OK" });
            })
            .catch(() => {
              res.send({ token: "", message: "NO USER FOUND" });
            });
        }
      })
      .catch((err) => {
        res.send({ token: "", message: "ERROR" });
      });
  });
  app.get(keys.sub + "/", async (req, res) => {
    res.send("customers server");
  });
  app.get(keys.sub + "/customers", async (req, res) => {
    const request = req.query;
    const result = await customers.find({ active: true });
    res.send(result);
  });

  app.get(keys.sub + "/get_customer_list_count", async (req, res) => {
    const now = moment().subtract(1, "week").valueOf();
    const result = await customers.countDocuments({
      active: true,
      created_at: { $gte: now },
    });
    res.status(200).send({ count: result, status: "OK" });
  });
  app.get(keys.sub + "/get_customer_gender_list_count", async (req, res) => {
    const now = moment().subtract(1, "week").valueOf();
    const result = await customers.countDocuments({
      active: true,
      gender: "Male",
    });
    const result_female = await customers.countDocuments({
      active: true,
      gender: "Female",
    });
    const result_not_specified = await customers.countDocuments({
      active: true,
      gender: "Not Specified",
    });
    res.status(200).send({
      count: result,
      count_not_specified: result_not_specified,
      femalecount: result_female,
      status: "OK",
    });
  });
  app.get(keys.sub + "/get_login_logs", async (req, res) => {
    // const now = moment().subtract(1, "week").valueOf();
    const log = await logs.aggregate([
      { $sort: { created_at: -1 } },
      {
        $group: {
          _id: {
            month: { $month: "$created_at" },
            year: { $year: "$created_at" },
          },
          number_of_logins: { $sum: 1 },
        },
      },
    ]);
    res.status(200).send({ data: log, status: "OK" });
  });
  app.get(keys.sub + "/get_login_logs_today", async (req, res) => {
    const now3 = moment.utc().toDate();
    var startOfToday = new Date(
      now3.getFullYear(),
      now3.getMonth(),
      now3.getDate()
    );
    console.log("startOfToday", startOfToday, now3);
    const log = await logs.aggregate([
      {
        $match: {
          created_at: { $gte: startOfToday },
        },
      },
      { $sort: { created_at: 1 } },
      {
        $group: {
          _id: {
            hour: { $hour: "$created_at" },
            month: { $month: "$created_at" },
            year: { $year: "$created_at" },
          },
          date: {
            $first: "$created_at",
          },
          number_of_logins: { $sum: 1 },
        },
      },
    ]);
    const now = moment.utc().subtract(1, "days").toDate();
    var startOfyesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    console.log("startOfyesterday", startOfyesterday, startOfToday);
    const logyesterday = await logs.aggregate([
      {
        $match: {
          $and: [
            { created_at: { $gt: startOfyesterday } },
            { created_at: { $lt: startOfToday } },
          ],
        },
      },
      { $sort: { created_at: 1 } },
      {
        $group: {
          _id: {
            hour: { $hour: "$created_at" },
            year: { $year: "$created_at" },
          },
          date: {
            $first: "$created_at",
          },
          number_of_logins: { $sum: 1 },
        },
      },
    ]);
    res.status(200).send({ today: log, yesterday: logyesterday });
  });
  app.get(keys.sub + "/get_returning_customers", async (req, res) => {
    const now3 = moment.utc().toDate();
    var startOfToday = new Date(
      now3.getFullYear(),
      now3.getMonth(),
      now3.getDate()
    );
    console.log("startOfToday", startOfToday, now3);
    const log = await logs.aggregate([
      {
        $match: {
          not_new: false,
          created_at: { $gte: startOfToday },
        },
      },
      { $sort: { created_at: 1 } },
      {
        $group: {
          _id: {
            hour: { $hour: "$created_at" },
            month: { $month: "$created_at" },
            year: { $year: "$created_at" },
          },
          date: {
            $first: "$created_at",
          },
          number_of_logins: { $sum: 1 },
        },
      },
    ]);
    const log2 = await logs.aggregate([
      {
        $match: {
          not_new: true,
          created_at: { $gte: startOfToday },
        },
      },
      { $sort: { created_at: 1 } },
      {
        $group: {
          _id: {
            hour: { $hour: "$created_at" },
            month: { $month: "$created_at" },
            year: { $year: "$created_at" },
          },
          date: {
            $first: "$created_at",
          },
          number_of_logins: { $sum: 1 },
        },
      },
    ]);
    res.status(200).send({ today: log, new_visit: log2 });
  });
  app.get(keys.sub + "/get_unique_customers", async (req, res) => {
    // const now = moment().subtract(1, "week").valueOf();
    const result = await customers.countDocuments({
      active: true,
      visited_once: true,
    });
    res.status(200).send({ count: result, status: "OK" });
  });

  app.post(keys.sub + "/login", async (req, res) => {
    const request = req.body;
    const user = await customers.find({ username: request.username });
    if (user.length > 0) {
      if (bcrypt.compareSync(request.password, user[0].password)) {
        // Passwords match
        let ccc = user[0].visited_once;
        let token = bcrypt.hashSync(
          user[0].username + " " + user[0].password,
          10
        );
        user[0].login_token = token;
        user[0].visited_once = true;

        await user[0].save();
        // user[0].password = "";
        const log = new logs({
          customer_id: user[0]._id,
          not_new: ccc,
        });
        log.save();
        let check_initial_setup = false;
        res.send({
          token: token,
          user: user[0],
          message: "Login Successful",
          check_initial_setup,
        });
      } else {
        // Passwords don't match
        res.send({
          token: "",
          user: [],
          message: "username and password does not match.",
        });
      }
    } else {
      res.send({ token: "", user: [], message: "Username does not exist" });
    }
  });
  app.post(keys.sub + "/signup", async (req, res) => {
    const request = req.body;
    const user = await customers.find({ username: request.username });
    if (user.length == 0) {
      const useremail = await customers.find({ email: request.email });
      if (useremail.length == 0) {
        let hash = bcrypt.hashSync(request.password, 9);
        let code = Math.floor(Math.random() * (99999 - 10000)) + 10000;
        const customer = new customers({
          fname: request.firstname,
          lname: request.lastname,
          username: request.username,
          email: request.email,
          gender: request.gender,
          birthdate: request.birthdate,
          verification_code: code,
          password: hash,
          customer_timeline: [
            { timestamp: new Date(), log_text: "Account Registered" },
          ],
        });
        await customer.save();
        send_verification_code(code);
        res.send({ token: "", user: [], message: "OK", customer });
      } else {
        res.send({ token: "", user: [], message: "Email already exist" });
      }
    } else {
      res.send({ token: "", user: [], message: "Username already exist" });
    }
  });
  app.post(keys.sub + "/signup_from_guest", async (req, res) => {
    const request = req.body;
    const user = await customers.find({ username: request.username });
    if (user.length == 0) {
      const useremail = await customers.find({ email: request.email });
      if (useremail.length == 0) {
        if (
          request._id != "" &&
          request._id != undefined &&
          request._id != null
        ) {
          let code = Math.floor(Math.random() * (99999 - 10000)) + 10000;

          let hash = bcrypt.hashSync(request.password, 9);
          let token = bcrypt.hashSync(request.username + " " + hash, 10);
          const customer = new customers({
            _id: request._id,
            fname: request.firstname,
            lname: request.lastname,
            username: request.username,
            email: request.email,
            phone: request.phone,
            verification_code: code,
            password: hash,
            login_token: token,
            visited_once: true,
            customer_timeline: [
              { timestamp: new Date(), log_text: "Account Registered" },
            ],
          });
          await customer
            .save()
            .then((info) => {
              send_verification_code(code);
              res.send({ token: "", user: info, message: "OK" });
            })
            .catch(() => {
              res.send({
                token: "",
                user: [],
                message:
                  "User already Registered..Try to Login using that account..",
              });
            });
        } else {
          res.send({
            token: "",
            user: [],
            message: "something went wrong please try again later..",
          });
        }
      } else {
        res.send({ token: "", user: [], message: "Email already exist" });
      }
    } else {
      res.send({ token: "", user: [], message: "Username already exist" });
    }
  });
  app.post(keys.sub + "/check_auth", async (req, res) => {
    const request = req.body;
    const user = await customers.findOne({ _id: request._id });
    console.log(user);
    if (user != null) {
      console.log(user.username);
      if (
        bcrypt.compareSync(
          user.username + " " + user.password,
          request.login_token
        )
      ) {
        res.send({ data: user, status: "OK" });
      } else {
        res.send({ data: [], status: "FAILED", message: "invalid token" });
      }
    } else {
      res.send({ data: [], status: "FAILED", message: "not found" });
    }
  });
  app.post(keys.sub + "/update_account", async (req, res) => {
    const request = req.body;
    await customers.findOne({ _id: request._id }).then(async (result) => {
      if (result == null) {
        res.send({ status: "ERROR", message: "no Account Found" });
      } else {
        let customer_timeline = result.customer_timeline;
        customer_timeline.push({
          timestamp: new Date(),
          log_text: "Account Detail Updated",
        });
        result.fname = request.fname;
        result.lname = request.lname;
        result.landmarks = request.landmarks;
        result.street = request.street;
        result.city = request.city;
        result.country = request.country;
        result.postal_code = request.postal;
        result.birthdate = request.birthdate;
        result.email = request.email;
        result.gender = request.gender;
        result.phone = request.phone;
        result.customer_timeline = customer_timeline;
        result.save();
        res.send({
          status: "OK",
          message: "Account Successfully Updated",
          data: result,
        });
      }
    });
  });
  app.post(keys.sub + "/update_account_password", async (req, res) => {
    const request = req.body;
    await customers.findOne({ _id: request._id }).then(async (result) => {
      if (result == null) {
        res.send({ status: "ERROR", message: "no Account Found" });
      } else {
        if (bcrypt.compareSync(request.current_password, result.password)) {
          let hash = bcrypt.hashSync(request.new_password, 9);
          let customer_timeline = result.customer_timeline;
          customer_timeline.push({
            timestamp: new Date(),
            log_text: "Account password Updated",
          });
          result.password = hash;
          result.customer_timeline = customer_timeline;
          result.save();
          res.send({
            status: "OK",
            message: "Account Successfully Updated",
            data: result,
          });
        } else {
          res.send({
            status: "ERROR",
            message: "Current Password is Incorrect",
            data: result,
          });
        }
      }
    });
  });
  app.get(keys.sub + "/:id", async (req, res) => {
    const id = req.params.id;
    const custo = await customers.findOne({ _id: id });
    res.send(custo);
  });
};
