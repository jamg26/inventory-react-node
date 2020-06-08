const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("users");
const Companies = mongoose.model("companies");
module.exports = (app) => {
  app.get(keys.sub + "/users", async (req, res) => {
    const request = req.query;
    const result = await User.find({ status: true })
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.send(err);
      });
  });
  app.post(keys.sub + "/user/initial_setup_account", async (req, res) => {
    const request = req.body;
    console.log(request);
    await User.findOne({ _id: request.account_id }).then(async (user) => {
      const company = new Companies({
        company_name: request.initialShopname,
      });
      await company.save();
      user.name = request.initialName;
      user.username = request.initialUserName;
      user.company_id = company._id;
      user.password = bcrypt.hashSync(request.NewPassword, 9);
      await user.save();
      res.send(user);
    });
  });
  app.post(keys.sub + "/user/save_user", async (req, res) => {
    const request = req.body;

    await User.find({ email: request.email }).then(async (user) => {
      console.log(request.password + " " + request.confirm_password);
      if (request.password == request.confirm_password) {
        console.log(user.length);
        let hash = bcrypt.hashSync(request.password, 9);

        if (user.length === 0) {
          const user = new User({
            name: request.name,
            position: request.position,
            email: request.email,
            password: hash,
          });
          await user.save();
          res.send("1");
        } else {
          res.send("already exist");
        }
      } else {
        res.send("The specified passwords do not match");
      }
    });
  });
  app.post(keys.sub + "/user/login", async (req, res) => {
    const request = req.body;
    const user = await User.find({ username: request.username });
    if (user.length > 0) {
      console.log(user[0].status);
      if (user[0].status == false) {
        res.send({ token: "", user: [], message: "Account has been disabled" });
      } else {
        if (bcrypt.compareSync(request.password, user[0].password)) {
          // Passwords match
          if (user[0].approved_status == "1") {
            let token = bcrypt.hashSync(
              user[0].username + " " + user[0].password,
              10
            );
            user[0].login_token = token;
            await user[0].save();
            // user[0].password = "";
            let check_initial_setup = false;
            if (user[0].position == "Admin") {
              if (user[0].company_id.length == 0) {
                check_initial_setup = true;
              } else {
                check_initial_setup = false;
              }
            }
            res.send({
              token: token,
              user: user[0],
              message: "Login Successful",
              check_initial_setup,
            });
          } else {
            res.send({ token: "", user: [], message: "Login Denied.." });
          }
        } else {
          // Passwords don't match
          res.send({
            token: "",
            user: [],
            message: "username and password does not match.",
          });
        }
      }
    } else {
      res.send({ token: "", user: [], message: "Username does not exist" });
    }
  });
  app.post(keys.sub + "/user/check_password", (req, res) => {
    const request = req.body;
    res.send(bcrypt.compareSync(request.user_password, request.encrypted));
  });
  app.post(keys.sub + "/user/checkemail", async (req, res) => {
    const request = req.body;
    const user = await User.find({ email: request.email });
    if (user.length > 0) {
      res.send("0");
    } else {
      res.send("1");
    }
  });
  app.post(keys.sub + "/user/check_auth", async (req, res) => {
    const request = req.body;
    const user = await User.findOne({ _id: request._id });
    console.log(user);
    if (user != null) {
      if (user.status == true) {
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
        res.send({ data: [], status: "INACTIVE ACCOUNT" });
      }
    } else {
      res.send({ data: [], status: "FAILED" });
    }
  });
};
