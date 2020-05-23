const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let PurchaseOrder = require("../model/schema/PurchaseOrder.js");
//models
const companies = mongoose.model("companies");
const productTags = mongoose.model("product_tags");
const products = mongoose.model("products");
const purchaseOrder = mongoose.model("purchase_orders");
const users = mongoose.model("users");

//routes
module.exports = (app) => {
  // app.get('/products', async (req, res) => {
  //     products.find(function (err, stock_control) {
  //         if (err) {
  //             console.log(err);
  //         } else {
  //             res.json(stock_control);
  //         }
  //     });
  // });

  // app.get(function (req, res) {
  //     let id = request.params.id;
  //     products.findById(id, function (err, stock_control) {
  //         res.json(stock_control);
  //     });
  // });
  // // Retrieve all Products
  // app.get("/products", async (req, res) => {
  //     products.find(function (err, products) {
  //         if (err) {
  //            console.log(err);
  //         } else {
  //             res.json(products);
  //         }
  //     });
  // });

  app.get("/purchase_orders", async (req, res) => {
    PurchaseOrder.find(function (err, stock_control) {
      if (err) {
        console.log(err);
      } else {
        res.json(stock_control);
      }
    });
  });

  app.get("/purchase_orders/purchase_order", async (req, res) => {
    let x = await PurchaseOrder.find({ type: "Purchase Order" });
    res.send(x);
  });
  app.get("/purchase_orders/stock_order", async (req, res) => {
    let x = await PurchaseOrder.find({ type: "Stock Order" });
    res.send(x);
  });
  app.get("/purchase_orders/return_order", async (req, res) => {
    let x = await PurchaseOrder.find({ type: "Return Order" });
    res.send(x);
  });

  app.get(function (req, res) {
    let id = request.params.id;
    PurchaseOrder.findById(id, function (err, stock_control) {
      res.json(stock_control);
    });
  });

  app.post("/purchase_orders/add", async (req, res) => {
    let stock_control = new PurchaseOrder(req.body);
    stock_control
      .save()
      .then((stock_control) => {
        res
          .status(200)
          .json({ "Purchase Order": "New Transaction Order Added" });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });

  app.delete("/purchase_orders/delete/:id", (req, res) => {
    purchaseOrder
      .findByIdAndDelete(req.params.id)
      .then(() => res.json({ remove: true }));
  });

  // Update a Product  with id
  app.post("/purchase_orders/update/:id", async (req, res) => {
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
  app.post("/purchase_orders/updated/draft", async (req, res) => {
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
  app.post("/purchase_orders/open", async (req, res) => {
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
  app.post("/purchase_orders/void", async (req, res) => {
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
