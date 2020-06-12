const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const axios = require("axios");
//models
const orders = mongoose.model("orders");
const products = mongoose.model("products");
const settings = mongoose.model("settings");
const taxes = mongoose.model("taxes");
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
  app.post(keys.sub + "/sample", async (req, res) => {
    const request = req.body;
    res.send(request);
  });
  app.post(keys.sub + "/update_settings", checkAuth, async (req, res) => {
    const request = req.body;
    if (request.setting_id == undefined) {
      const setting = new settings({
        logo: request.imageUrl,
        name: request.org_name,
        industry: request.org_industry,
        type: request.org_business_type,
        location: request.org_business_location,
        streetone: request.org_street_one,
        streettwo: request.org_street_two,
        city: request.org_city,
        province: request.org_province,
        zipcode: request.org_zip_code,
        phone: request.org_phone,
        fax: request.org_fax,
        website: request.org_website,
        sender_email: request.org_sender_email,
        send_through_email: request.org_send_through,
        base_currency: request.org_base_currency,
        date_format: request.org_date_format,
        aws_region: request.aws_region,
        aws_access_key_id: request.aws_access_key_id,
        aws_secret_key: request.aws_secret_key,
        g_account_password: request.g_account_password,
      });
      setting
        .save()
        .then(() => {
          res.send({
            status: "OK",
            message: "Successfully Added new Setting Configuration",
          });
        })
        .catch(() => {
          res.status(400).send({
            status: "ERROR",
            message: "something went wrong adding your new setting!",
          });
        });
    } else {
      await settings
        .findOne({ _id: request.setting_id })
        .then((setting) => {
          if (setting == null) {
            res.status(400).send({
              status: "ERROR",
              message: "setting id cannot be found!",
            });
          } else {
            setting.logo = request.imageUrl;
            setting.name = request.org_name;
            setting.industry = request.org_industry;
            setting.type = request.org_business_type;
            setting.location = request.org_business_location;
            setting.streetone = request.org_street_one;
            setting.streettwo = request.org_street_two;
            setting.city = request.org_city;
            setting.province = request.org_province;
            setting.zipcode = request.org_zip_code;
            setting.phone = request.org_phone;
            setting.fax = request.org_fax;
            setting.website = request.org_website;
            setting.sender_email = request.org_sender_email;
            setting.send_through_email = request.org_send_through;
            setting.base_currency = request.org_base_currency;
            setting.date_format = request.org_date_format;
            setting.aws_region = request.aws_region;
            setting.aws_access_key_id = request.aws_access_key_id;
            setting.aws_secret_key = request.aws_secret_key;
            setting.g_account_password = request.g_account_password;
            setting
              .save()
              .then(() => {
                res.send({
                  status: "OK",
                  message: "Successfully Added new Setting Configuration",
                });
              })
              .catch(() => {
                res.status(400).send({
                  status: "ERROR",
                  message: "something went wrong adding your new setting!",
                });
              });
          }
        })
        .catch(() => {
          res.status(400).send({
            status: "ERROR",
            message: "something went wrong fetching your setting!",
          });
        });
    }
  });
  app.post(keys.sub + "/add_tax_group", checkAuth, async (req, res) => {
    const { name } = req.body;
    const tax = new taxes({
      tax_group_name: name,
    });
    await tax
      .save()
      .then(() => {
        res.send({
          status: "OK",
          message: "Successfully Added new Tax Group",
        });
      })
      .catch(() => {
        res.status(400).send({
          status: "ERROR",
          message: "something went wrong adding your new tax group!",
        });
      });
  });
  app.post(
    keys.sub + "/update_tax_group_status",
    checkAuth,
    async (req, res) => {
      const { active, id } = req.body;
      const tax = taxes
        .findOne({ _id: id })
        .then(async (tt) => {
          if (tt == null) {
            res.status(400).send({
              status: "ERROR",
              message: "tax group not found!",
            });
          } else {
            tt.active = active;
            await tt
              .save()
              .then(() => {
                res.send({
                  status: "OK",
                  message: "Successfully Updated your Tax Group",
                });
              })
              .catch(() => {
                res.status(400).send({
                  status: "ERROR",
                  message: "something went wrong updating your tax group!",
                });
              });
          }
        })
        .catch(() => {
          res.status(400).send({
            status: "ERROR",
            message: "something went wrong fetching tax group!",
          });
        });
    }
  );
  app.post(keys.sub + "/update_tax_group_name", checkAuth, async (req, res) => {
    const { name, id } = req.body;
    const tax = taxes
      .findOne({ _id: id })
      .then(async (tt) => {
        if (tt == null) {
          res.status(400).send({
            status: "ERROR",
            message: "tax group not found!",
          });
        } else {
          tt.tax_group_name = name;
          await tt
            .save()
            .then(() => {
              res.send({
                status: "OK",
                message: "Successfully Updated your Tax Group",
              });
            })
            .catch(() => {
              res.status(400).send({
                status: "ERROR",
                message: "something went wrong updating your tax group!",
              });
            });
        }
      })
      .catch(() => {
        res.status(400).send({
          status: "ERROR",
          message: "something went wrong fetching tax group!",
        });
      });
  });
  app.post(keys.sub + "/add_tax_name", checkAuth, async (req, res) => {
    const { name, tax_name_tax_group, tax_rate } = req.body;
    const tax = taxes
      .findOne({ _id: tax_name_tax_group })
      .then(async (tt) => {
        if (tt == null) {
          res.status(400).send({
            status: "ERROR",
            message: "tax group not found!",
          });
        } else {
          let tax_names = [...tt.tax_names];

          tax_names.push({
            tax_group_id: tax_name_tax_group,
            name: name,
            rate: tax_rate,
          });
          tt.tax_names = tax_names;
          await tt
            .save()
            .then(() => {
              res.send({
                status: "OK",
                message: "Successfully Added new Tax",
              });
            })
            .catch(() => {
              res.status(400).send({
                status: "ERROR",
                message: "something went wrong adding your tax!",
              });
            });
        }
      })
      .catch(() => {
        res.status(400).send({
          status: "ERROR",
          message: "something went wrong fetching tax!",
        });
      });
  });
  app.post(keys.sub + "/update_tax_status", checkAuth, async (req, res) => {
    const { newactive, id, sub_id } = req.body;
    const tax = taxes
      .findOne({ _id: id })
      .then(async (tt) => {
        if (tt == null) {
          res.status(400).send({
            status: "ERROR",
            message: "tax group not found!",
          });
        } else {
          let tax_names = [...tt.tax_names];
          console.log(tt.tax_names);
          for (let x = 0; x < tax_names.length; x++) {
            if (tax_names[x]._id == sub_id) {
              tax_names[x].active = newactive;
              break;
            }
          }

          tt.tax_names = tax_names;
          await tt
            .save()
            .then(() => {
              res.send({
                status: "OK",
                message: "Successfully updated Tax",
              });
            })
            .catch(() => {
              res.status(400).send({
                status: "ERROR",
                message: "something went wrong updated tax!",
              });
            });
        }
      })
      .catch((err) => {
        res.status(400).send({
          status: "ERROR",
          message: "something went wrong fetching tax!",
        });
      });
  });
  app.post(keys.sub + "/update_tax_name", checkAuth, async (req, res) => {
    const { tax_name_tax_group, sub_id, name, tax_rate } = req.body;
    const tax = taxes
      .findOne({ _id: tax_name_tax_group })
      .then(async (tt) => {
        if (tt == null) {
          res.status(400).send({
            status: "ERROR",
            message: "tax group not found!",
          });
        } else {
          let tax_names = [...tt.tax_names];

          for (let x = 0; x < tax_names.length; x++) {
            if (tax_names[x]._id == sub_id) {
              tax_names[x].name = name;
              tax_names[x].rate = tax_rate;
              tax_names[x].tax_group_id = tax_name_tax_group;
              console.log(tax_names[x], tax_rate);
              break;
            }
          }

          tt.tax_names = tax_names;
          await tt
            .save()
            .then(() => {
              res.send({
                status: "OK",
                message: "Successfully updated Tax",
              });
            })
            .catch(() => {
              res.status(400).send({
                status: "ERROR",
                message: "something went wrong updated tax!",
              });
            });
        }
      })
      .catch((err) => {
        res.status(400).send({
          status: "ERROR",
          message: "something went wrong fetching tax!",
        });
      });
  });
};
