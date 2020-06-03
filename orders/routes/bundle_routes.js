const keys = require("../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//models
const bundles = mongoose.model("bundles");
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
  app.get(keys.sub + "/bundle_list", async (req, res) => {
    const Bundles = bundles
      .find({})
      .populate("product_type")
      .then((bundles) => {
        res.send({ status: "OK", message: "", data: bundles });
      })
      .catch(() => {
        res.status(400).send({
          status: "ERROR",
          message: "something went wrong fetching list of bundles",
          data: [],
        });
      });
  });
  app.post(
    keys.sub + "/bundles/update_to_bundle",
    checkAuth,
    async (req, res) => {
      const { data } = req.body;
      const Bundle = bundles
        .findOne({ _id: data._id })
        .then(async (bundle) => {
          if (bundle == null) {
            res.status(400).send({
              status: "ERROR",
              message: "Bundle ID not Found!!",
            });
          } else {
            bundle.name = data.name;
            bundle.description = data.description;
            bundle.product_type = data.product_type;
            bundle.product_tags = data.product_tags;
            bundle.image = data.image;
            bundle.brand = data.brand;
            bundle.supplier = data.supplier;
            bundle.supplier_code = data.supplier_code;
            bundle.sku = data.sku;
            bundle.barcode = data.barcode;
            bundle.initial_stock = data.initial_stock;
            bundle.bundle_items = data.bundle_items;
            await bundle
              .save()
              .then(() => {
                res.send({
                  status: "OK",
                  message: "Successfully Updated Bundle Data",
                });
              })
              .catch(() => {
                res.status(400).send({
                  status: "ERROR",
                  message:
                    "something went wrong while saving the bundle data!!",
                });
              });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({
            status: "ERROR",
            message: "something went wrong while fetching the bundle data!!",
            err: err,
          });
        });
    }
  );
  app.post(keys.sub + "/bundles/add_to_bundle", checkAuth, async (req, res) => {
    const request = req.body;

    const Bundle = new bundles({
      name: request.name,
      description: request.description,
      product_type: request.type,
      product_tags: request.tags,
      image: request.image,
      product_selection: request.product_selection,
      bundle_items: request.items,
      bundle_price: request.bundle_total,
      brand: request.brand,
      supplier: request.supplier,
      supplier_code: request.supplier_code,
      sku: request.sku,
      barcode: request.barcode,
      initial_stock: request.initial_stock,
    });
    await Bundle.save()
      .then(async (result) => {
        for (let x = 0; x < Bundle.bundle_items.length; x++) {
          await products
            .findOne({ _id: Bundle.bundle_items[x].parent_id })
            .then(async (product) => {
              if (!product) {
              } else {
                var variant_id = req.body.variant_id;
                for (let c = 0; c < product.variants.length; c++) {
                  if (
                    product.variants[c]._id == Bundle.bundle_items[x].variant_id
                  ) {
                    product.variants[c].logs.push({
                      log: "Product Added to a Bundle(" + Bundle.name + ")",
                    });
                  }
                }

                await product.save();
              }
            })
            .catch(() => {});
        }

        res.send({ status: "OK", message: "Sucessfully Added new Bundle" });
      })
      .catch((err) => {
        res.status(400).send({
          status: "ERROR",
          message: "something went wrong while saving the bundle data!!",
        });
      });
  });
};
