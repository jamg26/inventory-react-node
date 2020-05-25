const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//models
const supplier = mongoose.model("suppliers");
module.exports = (app) => {
  app.get(keys.sub + "/supplier_list", async (req, res) => {
    const list = await supplier.find({ active: true });
    res.send(list);
  });
  app.get(keys.sub + "/supplier_list_all", async (req, res) => {
    const list = await supplier.find();
    res.send(list);
  });
  app.post(keys.sub + "/update_supplier_status", async (req, res) => {
    const { value, id } = req.body;
    await supplier.findOne({ _id: id }).then((supplier) => {
      if (supplier == null) {
        res
          .status(400)
          .send({ status: "404", message: "Supplier cannot be found" });
      } else {
        supplier.active = value;
        supplier
          .save()
          .then((ss) => {
            res.send({
              status: "OK",
              message: "Successfully updated supplier Status",
            });
          })
          .catch((err) => {
            res.status(400).send({
              status: "SOMETHING WENT WRONG",
              message: "something went wrong!",
            });
          });
      }
    });
  });
  app.post(keys.sub + "/update_supplier", async (req, res) => {
    const {
      id,
      original_supplier_name,
      original_supplier_code,
      display_name,
      supplier_code,
      company_name,
      address,
      email,
      site_url,
      note,
    } = req.body;

    await supplier.findOne({ _id: id }).then(async (supplier) => {
      if (supplier == null) {
        res
          .status(400)
          .send({ status: "404", message: "Supplier cannot be found" });
      } else {
        let dupname = false;
        let dupcode = false;
        if (original_supplier_name != display_name) {
          const supnamecount = await supplier.countDocuments({
            display_name: display_name,
          });
          if (supnamecount > 0) {
            dupname = true;
          }
        }
        if (original_supplier_code != supplier_code) {
          const supcodecount = await supplier.countDocuments({
            supplier_code: supplier_code,
          });
          if (supcodecount > 0) {
            dupcode = true;
          }
        }
        if (!dupname) {
          if (!dupcode) {
            supplier.display_name = display_name;
            supplier.supplier_code = supplier_code;
            supplier.company_name = company_name;
            supplier.address = address;
            supplier.email = email;
            supplier.site_url = site_url;
            supplier.note = note;
            supplier
              .save()
              .then((ss) => {
                res.send({
                  status: "OK",
                  message: "Successfully updated supplier",
                });
              })
              .catch((err) => {
                res.status(400).send({
                  status: "SOMETHING WENT WRONG",
                  message: "something went wrong!",
                });
              });
          } else {
            res.status(400).send({
              status: "DUPLICATE Code",
              message: "Supplier Code already exist",
            });
          }
        } else {
          res.status(400).send({
            status: "DUPLICATE NAME",
            message: "Supplier Name already exist",
          });
        }
      }
    });
  });
  app.post(keys.sub + "/add_supplier", async (req, res) => {
    const {
      display_name,
      supplier_code,
      company_name,
      address,
      email,
      site_url,
      note,
    } = req.body;
    const supp = await supplier.countDocuments({ display_name: display_name });
    if (supp == 0) {
      const supp2 = await supplier.countDocuments({
        supplier_code: supplier_code,
      });
      if (supp2 == 0) {
        const Supplier = new supplier({
          display_name,
          supplier_code,
          company_name,
          address,
          email,
          site_url,
          note,
        });
        await Supplier.save()
          .then((supplier) => {
            res.status(200).send({
              status: "OK",
              message: "Successfully added new Supplier",
            });
          })
          .catch((err) => {
            res.status(400).send({
              status: "SOMETHING WENT WRONG!!",
              message: "something went wrong",
            });
          });
      } else {
        res.status(400).send({
          status: "SUPPLIER CODE ALREADY EXIST",
          message: "Supplier Code already exist",
        });
      }
    } else {
      res.status(400).send({
        status: "SUPPLIER NAME ALREADY EXIST",
        message: "Supplier Name already exist",
      });
    }
  });
};
