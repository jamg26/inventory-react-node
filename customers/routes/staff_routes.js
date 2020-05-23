const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const users = mongoose.model("users");
module.exports = (app) => {
  //get staff data
  app.get(keys.sub + "/staff", function (req, res) {
    users.find(function (err, users) {
      if (err) {
        console.log("failed");
      } else {
        res.json(users);
      }
    });
  });

  // add staff
  app.post(keys.sub + "/staff/add", async (req, res) => {
    let user = new users(req.body);
    let checker = await users.find({ email: req.body.email });
    if (checker.length == 0) {
      let checker = await users.find({ username: req.body.username });
      if (checker.length == 0) {
        let hash = bcrypt.hashSync(req.body.password, 9);
        user.password = hash;
        user
          .save()
          .then((user) => {
            res.status(200).send("staff added");
          })
          .catch((err) => {
            res.status(200).send("failed adding staff");
          });
      } else {
        res.status(200).send("Username already exist");
      }
    } else {
      res.status(200).send("Email already exist");
    }
  });

  // update status active or disabled
  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var date = new Date().getDate();
  var month = monthNames[new Date().getMonth()];
  var year = new Date().getFullYear();

  var dateToday = date + "-" + month + "-" + year;

  app.post(keys.sub + "/staff/update/status", function (req, res) {
    for (let i = 0; i < req.body.length; i++) {
      users.findById(req.body[i]._id, function (err, user) {
        if (!user) {
          res.status(400).send("id not found");
        } else {
          if (user.status === req.body[i].status) {
            if (req.bod[i].status == true) {
              console.log(user.name + " is already active");
            } else {
              console.log(user.name + " is already disabled");
            }
          } else {
            user.status = req.body[i].status;
            if (req.body[i].status == true) {
              user.action_log.push(
                "Status changed into active at " + dateToday
              );
            } else {
              user.action_log.push(
                "Status changed into disabled at " + dateToday
              );
            }

            user
              .save()
              .then((user) => {
                res.json("update status successful");
              })
              .catch((err) => {
                res.status(400).send("add status unsuccessful " + err);
              });
          }
        }
      });
    }
  });

  //edit staff info
  app.post(keys.sub + "/staff/edit", async (req, res) => {
    users.findById(req.body._id, async (err, user) => {
      if (!user) {
        res.status(200).send("id not found");
      } else {
        let checker = await users.find({ email: req.body.email });
        if (
          (checker.length == 1 && checker[0]._id == req.body._id) ||
          checker.length == 0
        ) {
          let checker = await users.find({ username: req.body.username });
          if (
            (checker.length == 1 && checker[0]._id == req.body._id) ||
            checker.length == 0
          ) {
            (user.name = req.body.name),
              (user.position = req.body.position),
              (user.email = req.body.email),
              (user.address = req.body.address),
              (user.birthday = req.body.birthday),
              (user.username = req.body.username),
              user.action_log.push("staff info edited at " + dateToday);

            user
              .save()
              .then((user) => {
                res.send("edit staff info successful");
              })
              .catch((err) => {
                res.status(200).send("edit staff info unsuccessful" + err);
              });
          } else {
            res.status(200).send("Username already exist");
          }
        } else {
          res.status(200).send("Email already exist");
        }
      }
    });
  });

  //edit account info
  app.post(keys.sub + "/profile/edit", function (req, res) {
    users.findById(req.body._id, async (err, user) => {
      if (!user) {
        res.status(200).send("id not found");
      } else {
        let checker = await users.find({ email: req.body.email });
        if (
          (checker.length == 1 && checker[0]._id == req.body._id) ||
          checker.length == 0
        ) {
          let checker = await users.find({ username: req.body.username });
          if (
            (checker.length == 1 && checker[0]._id == req.body._id) ||
            checker.length == 0
          ) {
            //password
            console.log(bcrypt.compareSync(req.body.password, user.password));
            if (bcrypt.compareSync(req.body.password, user.password)) {
              user.name = req.body.name;
              user.position = req.body.position;
              user.email = req.body.email;
              user.address = req.body.address;
              user.birthday = req.body.birthday;
              user.username = req.body.username;
              user.action_log.push("staff info edited at " + dateToday);

              user
                .save()
                .then((user) => {
                  res.send("edit staff info successful");
                })
                .catch((err) => {
                  res.status(200).send("edit staff info unsuccessful" + err);
                });
            } else {
              res.status(200).send("password does not match");
            }
          } else {
            res.status(200).send("Username already exist");
          }
        } else {
          res.status(200).send("Email already exist");
        }
      }
    });
  });
  app.post(keys.sub + "/profile/update_account_password", async (req, res) => {
    const request = req.body;
    await users.findOne({ _id: request._id }).then(async (result) => {
      if (result == null) {
        res.send({ status: "ERROR", message: "no Account Found" });
      } else {
        if (bcrypt.compareSync(request.current_password, result.password)) {
          let hash = bcrypt.hashSync(request.new_password, 9);

          result.password = hash;
          result.action_log.push(" Changed Password " + dateToday);
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
  //add note
  app.post(keys.sub + "/staff/add_note", function (req, res) {
    for (let i = 0; i < req.body.length; i++) {
      users.findById(req.body[i]._id, function (err, user) {
        if (!user) {
          res.status(400).send("id not found");
        } else {
          user.note.push({
            info: req.body[i].info,
            status: req.body[i].status,
          });
          user.action_log.push(
            "Note: " + req.body[i].info + " was added at " + dateToday
          );
          user
            .save()
            .then((user) => {
              res.json("add note successful");
            })
            .catch((err) => {
              res.status(400).send("add note unsuccessful" + err);
            });
        }
      });
    }
  });

  //delete note
  app.post(keys.sub + "/staff/delete/note", function (req, res) {
    users.findById(req.body.staff_id, function (err, user) {
      if (!user) {
        res.status(400).send("id not found");
      } else {
        for (let i = 0; i < user.note.length; i++) {
          if (user.note[i]._id == req.body.note_id) {
            user.note[i].status = false;
            user.action_log.push(
              "Note: " + user.note[i].info + " was deleted at " + dateToday
            );
            user
              .save()
              .then((user) => {
                res.json("delete note successful");
              })
              .catch((err) => {
                res.status(400).send("delete note unsuccessful" + err);
              });
            break;
          } else {
            continue;
          }
        }
      }
    });
  });
};
