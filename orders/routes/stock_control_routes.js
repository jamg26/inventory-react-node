const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//models
const companies = mongoose.model("companies");
const productTags = mongoose.model("product_tags");
const products = mongoose.model("products");
const PurchaseOrder = mongoose.model("purchase_orders");
const users = mongoose.model("users");

//routes
function checkAuth(req, res, next) {
  const { login_token } = req.body;
  console.log(login_token);
  if (login_token != "") {
    next();
  } else {
    res.status(401).send({ status: "unautorized" });
  }
}
module.exports = (app) => {
  app.get(keys.sub + "/purchase_orders", async (req, res) => {
    PurchaseOrder.find()
      .populate("product")
      .populate("received_by")
      .populate("entry_by")
      .populate("supplier")
      .then((stock_control) => {
        res.json(stock_control);
      })
      .catch(() => {
        res.status(400).send({ statut: "ERROR" });
      });
  });
  app.post(keys.sub + "/check_transfer_name", async (req, res) => {
    const { name } = req.body;
    let x = await PurchaseOrder.countDocuments({ transfer_name: name });
    res.send({ count: x });
  });
  app.post(keys.sub + "/fetch_transfer_data", async (req, res) => {
    const { transfer_name } = req.body;
    let x = await PurchaseOrder.find({
      transfer_name: transfer_name,
      type: "Stock Transfer",
      status: "DRAFT",
    });
    res.send({ data: x });
  });
  app.post(keys.sub + "/fetch_transfer_data_return_stock", async (req, res) => {
    const { transfer_name } = req.body;
    let x = await PurchaseOrder.find({
      transfer_name: transfer_name,
      type: "Return Stock",
      status: "DRAFT",
    });
    res.send({ data: x });
  });

  app.get(keys.sub + "/purchase_orders/purchase_order", async (req, res) => {
    let x = await PurchaseOrder.find({ type: "Purchase Order" });
    res.send(x);
  });
  app.get(keys.sub + "/purchase_orders/stock_order", async (req, res) => {
    let x = await PurchaseOrder.find({ type: "Stock Order" });
    res.send(x);
  });
  app.get(keys.sub + "/purchase_orders/return_order", async (req, res) => {
    let x = await PurchaseOrder.find({ type: "Return Order" });
    res.send(x);
  });
  app.post(
    keys.sub + "/update_purchase_order_drafts",
    checkAuth,
    async (req, res) => {
      for (let c = 0; c < req.body.data.length; c++) {
        const element = req.body.data[c];
        console.log(element);
        let stock_control = PurchaseOrder.findOne({ _id: element._id }).then(
          async (item) => {
            if (item == null) {
              console.log("new po");
              let ssss = new PurchaseOrder({
                po_no: req.body.data[c].po_no,
                invoice_no: req.body.data[c].invoice_no,
                supplier_note: req.body.data[c].supplier_note,
                total: req.body.data[c].total,
                product: req.body.data[c].product,
                variant: req.body.data[c].variant,
                supplier: req.body.data[c].supplier,
                bill_to: req.body.data[c].bill_to,
                stock_source: req.body.data[c].stock_source,
                ship_to: req.body.data[c].ship_to,
                delivery_due_date: req.body.data[c].delivery_due_date,
                quantity: req.body.data[c].quantity,
                item_cost: req.body.data[c].item_cost,
                tax: req.body.data[c].tax,
                entry_by: req.body.data[c].entry_by,
                type: req.body.data[c].type,
                transfer_name: req.body.data[c].transfer_name,
                status: req.body.data[c].status,
              });
              console.log("ssss", ssss);
              await ssss.save();
            } else {
              item.po_no = req.body.data[c].po_no;
              item.invoice_no = req.body.data[c].invoice_no;
              item.supplier_note = req.body.data[c].supplier_note;
              item.total = req.body.data[c].total;
              item.product = req.body.data[c].product;
              item.variant = req.body.data[c].variant;
              item.supplier = req.body.data[c].supplier;
              item.bill_to = req.body.data[c].bill_to;
              item.stock_source = req.body.data[c].stock_source;
              item.ship_to = req.body.data[c].ship_to;
              item.delivery_due_date = req.body.data[c].delivery_due_date;
              item.quantity = req.body.data[c].quantity;
              item.item_cost = req.body.data[c].item_cost;
              item.tax = req.body.data[c].tax;
              item.entry_by = req.body.data[c].entry_by;
              item.type = req.body.data[c].type;
              item.transfer_name = req.body.data[c].transfer_name;
              item.status = req.body.data[c].status;
              await item.save();
              //unfinised
            }
          }
        );
        if (parseFloat(req.body.data.length) == parseFloat(c) + parseFloat(1)) {
          res
            .status(200)
            .json({ "Purchase Order": "New Transaction Order Added" });
        }
      }
    }
  );
  app.post(keys.sub + "/void_po_item", checkAuth, async (req, res) => {
    const element = req.body;
    await PurchaseOrder.findOne({ _id: element.id })
      .then(async (result) => {
        result.status = "Void";
        await result
          .save()
          .then(async (ress) => {
            res.send({
              status: "OK",
              message: "Successfully finished Transaction",
            });
          })
          .catch((err) => {
            res.status(400).send({
              status: "ERROR",
              message: "something went wrong updating product",
            });
          });
      })
      .catch((err) => {
        res.status(400).send({
          status: "ERROR",
          message: "something went wrong fetching transaction",
        });
      });
  });
  app.post(keys.sub + "/receive_po_item", checkAuth, async (req, res) => {
    const element = req.body;
    await PurchaseOrder.findOne({ _id: element.id })
      .then(async (result) => {
        result.status = "Issued";
        result.received = true;
        result.received_by = element.webadmin_id;
        await result
          .save()
          .then(async (r) => {
            if (result.type == "Purchase Order") {
              await products
                .findOne({ _id: result.product })
                .then(async (product) => {
                  for (let c = 0; c < product.variants.length; c++) {
                    if (product.variants[c]._id == result.variant) {
                      product.variants[c].quantity =
                        parseFloat(product.variants[c].quantity) +
                        parseFloat(result.quantity);
                      break;
                    }
                  }
                  await product
                    .save()
                    .then(async () => {
                      res.send({
                        status: "OK",
                        message: "Successfully finished Transaction",
                      });
                    })
                    .catch(() => {
                      res.status(400).send({
                        status: "ERROR",
                        message: "something went wrong updating product",
                      });
                    });
                })
                .catch((err) => {
                  res.status(400).send({
                    status: "ERROR",
                    message: "something went wrong fetching product",
                  });
                });
            } else {
              await products
                .findOne({ _id: result.product })
                .then(async (product) => {
                  for (let c = 0; c < product.variants.length; c++) {
                    if (product.variants[c]._id == result.variant) {
                      let total =
                        parseFloat(product.variants[c].quantity) -
                        parseFloat(result.quantity);
                      product.variants[c].quantity = total;
                      break;
                    }
                  }
                  await product
                    .save()
                    .then(async () => {
                      res.send({
                        status: "OK",
                        message: "Successfully finished Transaction",
                      });
                    })
                    .catch(() => {
                      res.status(400).send({
                        status: "ERROR",
                        message: "something went wrong updating product",
                      });
                    });
                })
                .catch((err) => {
                  res.status(400).send({
                    status: "ERROR",
                    message: "something went wrong fetching product",
                  });
                });
            }
          })
          .catch((err) => {
            res.status(400).send({
              status: "ERROR",
              message: "something went wrong receiving transaction",
            });
          });
      })
      .catch((err) => {
        res.status(400).send({
          status: "ERROR",
          message: "something went wrong fetching transaction",
        });
      });
  });
  app.post(
    keys.sub + "/add_purchase_order_drafts",
    checkAuth,
    async (req, res) => {
      for (let c = 0; c < req.body.data.length; c++) {
        const element = req.body.data[c];
        let stock_control = new PurchaseOrder(req.body.data[c]);
        stock_control
          .save()
          .then((stock_control) => {
            if (
              parseFloat(req.body.data.length) ==
              parseFloat(c) + parseFloat(1)
            ) {
              res
                .status(200)
                .json({ "Purchase Order": "New Transaction Order Added" });
            }
          })
          .catch((err) => {
            if (
              parseFloat(req.body.data.length) ==
              parseFloat(c) + parseFloat(1)
            ) {
              res.status(400).send(err.message);
            }
          });
      }
    }
  );
  app.post(
    keys.sub + "/add_purchase_order_stock_transfer",
    checkAuth,
    async (req, res) => {
      for (let c = 0; c < req.body.data.length; c++) {
        const element = req.body.data[c];
        console.log(element);
        let stock_control = PurchaseOrder.findOne({ _id: element._id }).then(
          async (item) => {
            if (item == null) {
              let ssss = new PurchaseOrder({
                po_no: req.body.data[c].po_no,
                invoice_no: req.body.data[c].invoice_no,
                supplier_note: req.body.data[c].supplier_note,
                total: req.body.data[c].total,
                product: req.body.data[c].product,
                variant: req.body.data[c].variant,
                supplier: req.body.data[c].supplier,
                bill_to: req.body.data[c].bill_to,
                stock_source: req.body.data[c].stock_source,
                ship_to: req.body.data[c].ship_to,
                delivery_due_date: req.body.data[c].delivery_due_date,
                quantity: req.body.data[c].quantity,
                item_cost: req.body.data[c].item_cost,
                tax: req.body.data[c].tax,
                entry_by: req.body.data[c].entry_by,
                type: req.body.data[c].type,
                transfer_name: req.body.data[c].transfer_name,
              });

              await ssss.save();
            } else {
              item.po_no = req.body.data[c].po_no;
              item.invoice_no = req.body.data[c].invoice_no;
              item.supplier_note = req.body.data[c].supplier_note;
              item.total = req.body.data[c].total;
              item.product = req.body.data[c].product;
              item.variant = req.body.data[c].variant;
              item.supplier = req.body.data[c].supplier;
              item.bill_to = req.body.data[c].bill_to;
              item.stock_source = req.body.data[c].stock_source;
              item.ship_to = req.body.data[c].ship_to;
              item.delivery_due_date = req.body.data[c].delivery_due_date;
              item.quantity = req.body.data[c].quantity;
              item.item_cost = req.body.data[c].item_cost;
              item.tax = req.body.data[c].tax;
              item.entry_by = req.body.data[c].entry_by;
              item.type = req.body.data[c].type;
              item.transfer_name = req.body.data[c].transfer_name;
              item.status = "Open";
              await item.save();
              //unfinised
            }
          }
        );
        if (parseFloat(req.body.data.length) == parseFloat(c) + parseFloat(1)) {
          res
            .status(200)
            .json({ "Purchase Order": "New Transaction Order Added" });
        }
      }
    }
  );
  app.post(keys.sub + "/add_purchase_order", checkAuth, async (req, res) => {
    for (let c = 0; c < req.body.data.length; c++) {
      const element = req.body.data[c];
      let stock_control = new PurchaseOrder(req.body.data[c]);
      stock_control
        .save()
        .then((stock_control) => {
          if (
            parseFloat(req.body.data.length) ==
            parseFloat(c) + parseFloat(1)
          ) {
            res
              .status(200)
              .json({ "Purchase Order": "New Transaction Order Added" });
          }
        })
        .catch((err) => {
          if (
            parseFloat(req.body.data.length) ==
            parseFloat(c) + parseFloat(1)
          ) {
            res.status(400).send(err.message);
          }
        });
    }
  });

  app.delete(keys.sub + "/purchase_orders/delete/:id", (req, res) => {
    purchaseOrder
      .findByIdAndDelete(req.params.id)
      .then(() => res.json({ remove: true }));
  });

  // Update a Product  with id
  app.post(keys.sub + "/purchase_orders/update/:id", async (req, res) => {
    purchaseOrder.findById(req.params.id, function (err, order) {
      if (!order) {
        res.status(400).send("data not found");
      } else {
        order.po_no = req.body.po_no;
        order.invoice_no = req.body.invoice_no;
        order.supplier_note = req.body.supplier_note;
        order.total = req.body.total;
        order.stock_source = req.body.stock_source;
        order.due_date = req.body.due_date;
        order.received = req.body.received;
        order.type = req.body.type;
        order.status = req.body.status;
        order.po_items[0].ship_to = req.body.po_items[0].ship_to;
        order.po_items[0].bill_to = req.body.po_items[0].bill_to;
        order.po_items[0].quantity = req.body.po_items[0].quantity;
        order.po_items[0].delivery_due_date =
          req.body.po_items[0].delivery_due_date;
        order.po_items[0].item_cost = req.body.po_items[0].item_cost;
        order.po_items[0].tax = req.body.po_items[0].tax;
        order.po_items[0].total = req.body.po_items[0].total;

        order
          .save()
          .then((tag) => {
            res.json("Update Succesful");
          })
          .catch((err) => {
            res.status(400).send("Update not possible");
          });
      }
    });
  });

  // Update a Product  with Status Draft
  app.post(keys.sub + "/purchase_orders/updated/draft", async (req, res) => {
    const data = req.body.length;
    for (let x = 0; x < data; x++) {
      purchaseOrder.findById(req.body[x], function (err, order) {
        if (!order) {
        } else {
          order.status = "Draft";
          order
            .save()
            .then((tag) => {})
            .catch((err) => {});
        }
      });
    }
  });

  // Update a Product  with Status Open
  app.post(keys.sub + "/purchase_orders/open", async (req, res) => {
    const request = req.body;
    const data = req.body.length;
    const stats = 0;
    for (let x = 0; x < data; x++) {
      purchaseOrder.findById(req.body[x], function (err, order) {
        if (!order) {
        } else {
          order.status = "Open";
          order
            .save()
            .then((tag) => {})
            .catch((err) => {});
        }
      });
    }
  });

  // Update a Product  with Status Void
  app.post(keys.sub + "/purchase_orders/void", async (req, res) => {
    const request = req.body;
    const data = req.body.length;
    const stats = 0;
    for (let x = 0; x < data; x++) {
      purchaseOrder.findById(req.body[x], function (err, order) {
        if (!order) {
        } else {
          order.status = "Void";
          order
            .save()
            .then((tag) => {})
            .catch((err) => {});
        }
      });
    }
  });
};
