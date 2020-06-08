const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const axios = require("axios");
//models
const orders = mongoose.model("orders");
const products = mongoose.model("products");
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
  app.post(keys.sub + "/add_to_cart", checkAuth, (req, res) => {
    const { index, data, customer_id, customer_info } = req.body;
    const user_ip =
      req.ip.substr(0, 7) == "::ffff:" ? req.ip.substr(7) : req.ip;
    //get quantity ::
    //get ip ::
    //get product ::
    //pass product to order detail
    //generate a order no
    //customer_info
    orders
      .findOne({ active: false, customer: customer_id })
      .then(async (result) => {
        if (result == null) {
          // create new
          const order_no = await orders.find().countDocuments();
          const order = new orders({
            customer: customer_id,
            customer_info: customer_info,
            order_no: order_no,
            order_date: new Date(),
            ip_address: user_ip,
            line_item: [
              {
                product: index,
                quantity: data.initial_quantity,
                quantity_max: data.quantity,
                price: data.price_raw,
                original_price: data.price_raw,
                variant_id: data.product_variant_id,
                total:
                  parseFloat(data.price_raw) *
                  parseFloat(data.initial_quantity),
                delivery_status: "Pending",
              },
            ],
            order_log: [
              {
                log: "Cart Generated",
              },
            ],
          });
          await order.save();
          console.log(order);
        } else {
          //update order
          let order_log = result.order_log;
          order_log.push({
            log: "Added Item in Cart",
          });
          let ord = result.line_item;
          let concat = false;
          for (let c = 0; c < ord.length; c++) {
            if (ord[c].variant_id === data.product_variant_id) {
              ord[c].quantity = parseFloat(data.initial_quantity);
              ord[c].total =
                parseFloat(ord[c].total) +
                parseFloat(data.price_raw) * parseFloat(data.initial_quantity);
              concat = true;
              break;
            }
          }
          if (concat === false) {
            ord.push({
              product: index,
              quantity: data.initial_quantity,
              price: data.price_raw,
              quantity_max: data.quantity,
              original_price: data.price_raw,
              variant_id: data.product_variant_id,
              total:
                parseFloat(data.price_raw) * parseFloat(data.initial_quantity),
              delivery_status: "Pending",
            });
          }
          result.line_item = ord;
          result.order_log = order_log;
          result.save();
          console.log(ord);
        }
        res.status(201).send(data);
      });
  });
  app.post(keys.sub + "/cancel_order", checkAuth, async (req, res) => {
    const { id } = req.body;
    await orders.findOne({ _id: id }).then(async (result) => {
      if (result == null) {
        res.status(401).send({ status: "Not Found" });
      } else {
        if (result.order_status != "Pending") {
          res.status(401).send({ status: "Invalid Operation" });
        } else {
          result.order_status = "Cancelled";
          await result.save();
          res.status(200).send({
            status: "success",
            message: "Successfully cancelled Order",
          });
        }
      }
    });
  });
  app.post(keys.sub + "/update_cart", checkAuth, async (req, res) => {
    const {
      order_id,
      product_id,
      product_variant_id,
      quantity,
      item_id,
    } = req.body;
    await orders
      .findOne({ _id: order_id, active: false })
      .then(async (result) => {
        if (result == null) {
          res.send("No Order Found");
        } else {
          console.log(
            order_id,
            product_id,
            product_variant_id,
            quantity,
            item_id
          );
          if (quantity == 0) {
            let variants = result.line_item;
            let index = 0;
            for (let x = 0; x < variants.length; x++) {
              if (item_id == variants[x]._id) {
                index = x;
                break;
              }
            }
            variants.splice(index, 1);
            await result.save();
            res.send({ cart: result, status: "removed" });
          } else {
            let message = "";
            let variants = result.line_item;
            for (let x = 0; x < variants.length; x++) {
              if (item_id == variants[x]._id) {
                const prod = await products.findOne({
                  _id: variants[x].product[0]._id,
                });
                let max = 0;
                if (prod != null) {
                  for (let zx = 0; zx < prod.variants.length; zx++) {
                    console.log(prod.variants[zx]);
                    if (prod.variants[zx]._id == variants[x].variant_id) {
                      max = parseFloat(prod.variants[zx].quantity);
                      break;
                    }
                  }
                }
                console.log("max quantity", max);
                if (quantity <= max) {
                  variants[x].quantity = quantity;
                  variants[x].quantity_max = max;

                  message = "updated";
                } else {
                  variants[x].quantity_max = max;
                  message = "don't have enough stock.";
                }
                break;
              }
            }
            await result.save();
            res.send({ cart: result, status: message });
          }
        }
      });
  });
  app.post(
    keys.sub + "/update_cart_additional_detail",
    checkAuth,
    async (req, res) => {
      const { order_id, note, deliveryMethod } = req.body;
      await orders
        .findOne({ _id: order_id, active: false })
        .then(async (result) => {
          if (result == null) {
            res.send("No Order Found");
          } else {
            result.order_note = note;
            result.delivery_method = deliveryMethod;
            await result.save();
            res.send({ cart: result, status: "updated" });
          }
        });
    }
  );
  app.post(
    keys.sub + "/update_cart_contact_info",
    checkAuth,
    async (req, res) => {
      const {
        fname,
        lname,
        company_name,
        address,
        email,
        phone,
        order_id,
      } = req.body;
      await orders
        .findOne({ _id: order_id, active: false })
        .then(async (result) => {
          if (result == null) {
            res.send("No Order Found");
          } else {
            result.customer_info.fname = fname;
            result.customer_info.lname = lname;
            result.customer_info.company_name = company_name;
            result.customer_info.address = address;
            result.customer_info.email = email;
            result.customer_info.phone = phone;
            result.order_log.push({
              log: "Cart Contact Info Updated",
            });
            await result.save();
            res.send({ cart: result, status: "updated" });
          }
        });
    }
  );
  app.post(keys.sub + "/add_cart_to_order", checkAuth, async (req, res) => {
    const { order_id, details, amou } = req.body;
    await orders
      .findOne({ _id: order_id, active: false })
      .then(async (result) => {
        if (result == null) {
          res.send("No Order Found");
        } else {
          result.payment_total = amou;
          result.payment_status = "PAID";
          result.payment_info = details;
          result.payment_date = new Date();
          result.check_out_date = new Date();
          result.active = true;
          result.order_log.push({
            log: "Order Placed",
          });
          await result.save();

          for (let c = 0; c < result.line_item.length; c++) {
            console.log(
              result.line_item[c].product[0]._id +
                " " +
                result.line_item[c].variant_id
            );
            let product = products
              .findOne({ _id: result.line_item[c].product[0]._id })
              .then(async (prod) => {
                if (prod.variants.length != 0) {
                  for (let x = 0; x < prod.variants.length; x++) {
                    if (
                      prod.variants[x]._id == result.line_item[c].variant_id
                    ) {
                      console.log(
                        "QUANTITIES " +
                          prod.variants[x].quantity +
                          " " +
                          result.line_item[c].quantity
                      );
                      let latest =
                        parseFloat(prod.variants[x].quantity) -
                        parseFloat(result.line_item[c].quantity);
                      prod.variants[x].quantity = latest;
                      prod.variants[x].logs.push({
                        log:
                          "Product is Placed on Order with id# '" +
                          order_id +
                          "' in quantity of " +
                          result.line_item[c].quantity,
                      });
                      console.log("found you");
                    }
                  }
                  await prod.save();
                }
              });
          }

          res.send({ cart: result, status: "updated" });
        }
      });
    //update product quantity
  });
  app.post(keys.sub + "/update_staffs", async (req, res) => {
    const request = req.body;
    await orders.findOne({ _id: request.order_id }).then(async (result) => {
      if (result == null) {
        res.send("No Order Found");
      } else {
        let order_log = result.order_log;
        order_log.push({
          log: "Staff updated",
        });
        const filter = { _id: request.order_id };
        const update = {
          bagger: request.bagger,
          checker: request.checker,
          releaser: request.releaser,
          driver: request.driver,
          supervisor: request.supervisor,
          order_log: order_log,
        };
        let data = await orders.findOneAndUpdate(filter, update, { new: true });
        res.send(result);
      }
    });
    // const result = await companies.find();
  });
  app.post(keys.sub + "/update_staffs_note", async (req, res) => {
    const request = req.body;
    await orders.findOne({ _id: request.order_id }).then(async (result) => {
      if (result == null) {
        res.send("No Order Found");
      } else {
        console.log(result.staff_note.length);
        let order_log = result.order_log;
        order_log.push({
          log: "Added Staff note",
        });
        if (
          result.staff_note.length != 0 &&
          result.staff_note.length != undefined
        ) {
          var exist = 0;
          for (var c = 0; c < result.staff_note.length; c++) {
            if (result.staff_note[c].staff == request.staff_id) {
              exist = 1;
              result.staff_note[c] = {
                staff: request.staff_id,
                note: request.note,
                order_log: order_log,
              };
            }
          }
          if (exist == 0) {
            result.staff_note.push({
              staff: request.staff_id,
              note: request.note,
              order_log: order_log,
            });
          }
        } else {
          console.log(result);
          result.staff_note.push({
            staff: request.staff_id,
            note: request.note,
            order_log: order_log,
          });
        }
        await result.save().then((result) => {
          res.send(result);
        });
      }
    });
  });
};
