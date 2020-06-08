const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const axios = require("axios");
//models
const orders = mongoose.model("orders");
const products = mongoose.model("products");
const product_types = mongoose.model("product_types");
const moment = require("moment");
function checkAuth(req, res, next) {
  const { login_token } = req.body;
  console.log(login_token);
  if (login_token != "") {
    next();
  } else {
    res
      .status(401)
      .send({ status: "unautorized", message: "User not Authorized" });
  }
}
module.exports = (app) => {
  app.get(keys.sub + "/", async (req, res) => {
    res.send("order server");
  });
  app.get(keys.sub + "/get_new_orders", async (req, res) => {
    const now = moment().subtract(1, "week").valueOf();
    console.log(now);
    const neworders = await orders.countDocuments({
      active: true,
      $and: [
        { order_status: { $ne: "Completed" } },
        { order_status: { $ne: "Cancelled" } },
      ],
      check_out_date: { $gte: now },
    });
    console.log(neworders);
    res.send({ count: neworders });
  });
  app.get(keys.sub + "/get_cancelled_orders", async (req, res) => {
    const now = moment().subtract(1, "week").valueOf();
    console.log(now);
    const neworders = await orders.countDocuments({
      active: true,
      order_status: "Cancelled",
      check_out_date: { $gte: now },
    });
    console.log(neworders);
    res.send({ count: neworders });
  });
  app.get(keys.sub + "/get_delivered_in_a_month", async (req, res) => {
    const now = moment().subtract(4, "week").valueOf();
    console.log(now);
    const neworders = await orders.countDocuments({
      active: true,
      order_status: "Completed",
      delivery_date: { $gte: now },
    });
    console.log(neworders);
    res.send({ count: neworders });
  });
  app.get(keys.sub + "/customer_cart/:id", async (req, res) => {
    const request = req.params;
    const cart = await orders.findOne({ customer: request.id, active: false });
    res.send({ cart });
  });
  app.get(keys.sub + "/get_categories", async (req, res) => {
    const product_types_list = await product_types.find({
      product_type_active: true,
    });
    res.send({ product_types_list });
  });
  app.get(
    keys.sub + "/customer_order_history/:id",

    async (req, res) => {
      const request = req.params;
      const cart = await orders
        .find({ customer: request.id, active: true })
        .sort({ order_date: -1 })
        .populate("bagger")
        .populate("checker")
        .populate("releaser")
        .populate("driver")
        .populate("supervisor")
        .populate("customer");
      res.send({ cart });
    }
  );

  app.get(keys.sub + "/abandoned_orders", async (req, res) => {
    const request = req.query;
    const result = await orders
      .find({ active: false })
      .populate("bagger")
      .populate("checker")
      .populate("releaser")
      .populate("driver")
      .populate("supervisor")
      .populate("customer");
    res.send(result);
  });
  app.get(keys.sub + "/orders", async (req, res) => {
    const request = req.query;
    const result = await orders
      .find({ active: true })
      .populate("bagger")
      .populate("checker")
      .populate("releaser")
      .populate("driver")
      .populate("supervisor")
      .populate("customer");
    res.send(result);
  });
  app.get(keys.sub + "/all_orders_items_grouped", async (req, res) => {
    const request = req.query;
    const result = await orders.aggregate([
      {
        $match: {
          active: true,
          order_status: "Completed",
        },
      },
      {
        $unwind: "$line_item",
      },
      {
        $group: {
          _id: {
            product_id: "$line_item.product._id",
          },
          name: {
            $first: "$line_item.product.product_name",
          },
          description: {
            $first: "$line_item.product.product_description",
          },
          variant_id: {
            $first: "$line_item.variant_id",
          },
          info: {
            $first: "$line_item.product",
          },
          number_of_orders: {
            $sum: {
              $toDouble: "$line_item.quantity",
            },
          },
        },
      },
      {
        $sort: { number_of_orders: -1 },
      },
      {
        $limit: 4,
      },
    ]);
    res.send(result);
  });
  app.get(keys.sub + "/get_todays_revenue", async (req, res) => {
    const now3 = new Date();
    var startOfToday = new Date(
      now3.getFullYear(),
      now3.getMonth(),
      now3.getDate()
    );
    console.log(now3);
    const result2 = await orders.aggregate([
      {
        $match: {
          active: true,
          order_status: "Completed",
          payment_date: { $gte: startOfToday },
        },
      },

      {
        $group: {
          _id: { active: { active: true } },
          total_rev: {
            $sum: {
              $toDouble: "$payment_total",
            },
          },
          number_of_orders: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);
    res.send({ total_revenue: result2.length != 0 ? result2[0].total_rev : 0 });
  });
  app.get(keys.sub + "/get_checkout_today", async (req, res) => {
    const now3 = new Date();
    var startOfToday = new Date(
      now3.getFullYear(),
      now3.getMonth(),
      now3.getDate()
    );
    console.log(startOfToday);
    const result2 = await orders.aggregate([
      {
        $match: {
          active: true,
          order_status: { $ne: "Cancelled" },
          check_out_date: { $gte: startOfToday },
        },
      },

      {
        $group: {
          _id: { hour: { $hour: "$check_out_date" } },
          date: {
            $first: "$check_out_date",
          },
          total_rev: {
            $sum: {
              $toDouble: "$payment_total",
            },
          },
          number_of_orders: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);
    const now = moment.utc().subtract(1, "days").toDate();
    var yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    console.log("now", yesterday);
    const resultyesterday = await orders.aggregate([
      {
        $match: {
          active: true,
          order_status: { $ne: "Cancelled" },
          $and: [
            { check_out_date: { $gt: yesterday } },
            { check_out_date: { $lt: startOfToday } },
          ],
        },
      },

      {
        $group: {
          _id: { hour: { $hour: "$check_out_date" } },
          date: {
            $first: "$check_out_date",
          },
          total_rev: {
            $sum: {
              $toDouble: "$payment_total",
            },
          },
          number_of_orders: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);
    res.send({
      today: result2,
      resultyesterday: resultyesterday,
    });
  });

  app.get(keys.sub + "/get_add_to_cart_today", async (req, res) => {
    const now3 = new Date();
    var startOfToday = new Date(
      now3.getFullYear(),
      now3.getMonth(),
      now3.getDate()
    );
    console.log(now3);
    const result2 = await orders.countDocuments({
      active: false,
      created_at: { $gte: startOfToday },
    });
    const result22 = await orders.countDocuments({
      active: true,
      created_at: { $gte: startOfToday },
    });
    const result222 = await orders.countDocuments({
      active: true,
      order_status: "Completed",
      created_at: { $gte: startOfToday },
    });
    res.send({ carted: result2, ordered: result22, completed: result222 });
  });
  app.get(keys.sub + "/get_this_weeks_revenue", async (req, res) => {
    const now3 = moment.utc().subtract(1, "week").toDate();
    console.log(now3);
    const result2 = await orders.aggregate([
      {
        $match: {
          active: true,
          order_status: "Completed",
          payment_date: { $gte: now3 },
        },
      },

      {
        $group: {
          _id: {
            month: { $dayOfYear: "$payment_date" },
            year: { $year: "$payment_date" },
          },
          date: {
            $first: "$payment_date",
          },
          total_rev: {
            $sum: {
              $toDouble: "$payment_total",
            },
          },
          number_of_orders: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);
    res.send(result2);
  });
  app.get(keys.sub + "/get_total_revenue", async (req, res) => {
    const request = req.query;
    const result = await orders.aggregate([
      {
        $match: {
          active: true,
          order_status: "Completed",
        },
      },

      {
        $group: {
          _id: {
            month: { $month: "$payment_date" },
            year: { $year: "$payment_date" },
          },
          date: {
            $first: "$payment_date",
          },
          payment_total: {
            $sum: {
              $toDouble: "$payment_total",
            },
          },
          number_of_orders: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);
    const daily_result = await orders.aggregate([
      {
        $match: {
          active: true,
          order_status: "Completed",
        },
      },

      {
        $group: {
          _id: {
            month: { $dayOfYear: "$payment_date" },
            year: { $year: "$payment_date" },
          },
          date: {
            $first: "$payment_date",
          },
          payment_total: {
            $sum: {
              $toDouble: "$payment_total",
            },
          },
          number_of_orders: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);

    const result2 = await orders.aggregate([
      {
        $match: {
          active: true,
          order_status: "Completed",
        },
      },

      {
        $group: {
          _id: { active: { active: true } },
          total_rev: {
            $sum: {
              $toDouble: "$payment_total",
            },
          },
          number_of_orders: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);
    const now = moment.utc().subtract(4, "week").toDate();
    const ordersweek = await orders.aggregate([
      {
        $match: {
          active: true,
          order_status: "Completed",
          payment_date: { $lte: now },
        },
      },
      {
        $group: {
          _id: { active: { active: true } },
          total_rev: {
            $sum: {
              $toDouble: "$payment_total",
            },
          },
          number_of_orders: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);

    const now2 = moment.utc().subtract(8, "week").toDate();
    const ordersweek2 = await orders.aggregate([
      {
        $match: {
          active: true,
          order_status: "Completed",
          payment_date: { $lte: now2 },
        },
      },
      {
        $group: {
          _id: { active: { active: true } },
          total_rev: {
            $sum: {
              $toDouble: "$payment_total",
            },
          },
          number_of_orders: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);
    const now3 = moment.utc().subtract(12, "week").toDate();
    const ordersweek3 = await orders.aggregate([
      {
        $match: {
          active: true,
          order_status: "Completed",
          payment_date: { $lte: now3 },
        },
      },
      {
        $group: {
          _id: { active: { active: true } },
          total_rev: {
            $sum: {
              $toDouble: "$payment_total",
            },
          },
          number_of_orders: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);
    const now4 = moment.utc().subtract(24, "week").toDate();
    const ordersweek4 = await orders.aggregate([
      {
        $match: {
          active: true,
          order_status: "Completed",
          payment_date: { $lte: now4 },
        },
      },
      {
        $group: {
          _id: { active: { active: true } },
          total_rev: {
            $sum: {
              $toDouble: "$payment_total",
            },
          },
          number_of_orders: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);
    const now5 = moment.utc().subtract(48, "week").toDate();
    const ordersweek5 = await orders.aggregate([
      {
        $match: {
          active: true,
          order_status: "Completed",
          payment_date: { $lte: now5 },
        },
      },
      {
        $group: {
          _id: { active: { active: true } },
          total_rev: {
            $sum: {
              $toDouble: "$payment_total",
            },
          },
          number_of_orders: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);
    data = {
      chart_data: result,
      daily_result: daily_result,
      total_revenue: result2.length != 0 ? result2[0].total_rev : 0,
      month_one: ordersweek.length != 0 ? ordersweek[0].total_rev : 0,
      month_two: ordersweek2.length != 0 ? ordersweek2[0].total_rev : 0,
      month_three: ordersweek3.length != 0 ? ordersweek3[0].total_rev : 0,
      month_four: ordersweek4.length != 0 ? ordersweek4[0].total_rev : 0,
      month_five: ordersweek5.length != 0 ? ordersweek5[0].total_rev : 0,
    };
    res.send(data);
  });
  app.get(keys.sub + "/all_orders", async (req, res) => {
    const request = req.query;
    const result = await orders
      .find({ active: true })
      .populate("bagger")
      .populate("checker")
      .populate("releaser")
      .populate("driver")
      .populate("supervisor")
      .populate("customer");
    res.send(result);
  });
  app.post(keys.sub + "/order_by_customer", async (req, res) => {
    const request = req.body;
    const result = await orders
      .find({ customer: request.id })
      .sort({ order_date: -1 })
      .populate("bagger")
      .populate("checker")
      .populate("releaser")
      .populate("driver")
      .populate("supervisor")
      .populate("customer");
    res.send(result);
  });
  app.post(keys.sub + "/order_by_id", async (req, res) => {
    const request = req.body;
    const result = await orders
      .find({ _id: request.id })
      .populate("bagger")
      .populate("checker")
      .populate("releaser")
      .populate("driver")
      .populate("supervisor")
      .populate("customer");
    res.send(result);
  });
};
