const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//models{ customer_timeline: { log_text: "Customer Account Created" } }
const customers = mongoose.model("customers");
module.exports = (app) => {
  app.get(keys.sub + "/", async (req, res) => {
    res.send("customers server");
  });
  app.get(keys.sub + "/customers", async (req, res) => {
    const request = req.query;
    const result = await customers.find({ active: true });
    res.send(result);
  });
  app.post(keys.sub + "/login", async (req, res) => {
    const request = req.body;
    const user = await customers.find({ username: request.username });
    if (user.length > 0) {
      if (bcrypt.compareSync(request.password, user[0].password)) {
        // Passwords match

        let token = bcrypt.hashSync(
          user[0].username + " " + user[0].password,
          10
        );
        user[0].login_token = token;
        await user[0].save();
        // user[0].password = "";
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
        const customer = new customers({
          fname: request.firstname,
          lname: request.lastname,
          username: request.username,
          email: request.email,
          password: hash,
          customer_timeline: [
            { timestamp: new Date(), log_text: "Account Registered" },
          ],
        });
        await customer.save();
        res.send({ token: "", user: [], message: "OK" });
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
        res.send({ data: [], status: "FAILED" });
      }
    } else {
      res.send({ data: [], status: "FAILED" });
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
