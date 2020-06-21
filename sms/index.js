const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
// const keys = require("./config/keys");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
var twilio = require("twilio");
const app = express();
app.use(compression());
var cors = require("cors");
app.use(bodyParser.json({ limit: "50mb" }));
//require models
// require("./model");
//apply CORS middleware
app.use(cors());
app.use(
  fileUpload({
    createParentPath: true,
  })
);
//email - ceciliogmaing13@gmail.com
// password - Odanobunaga1313
app.get("/", async (req, res) => {
  var accountSid = "ACd3f86c07cc1e15076c342d9d4ccdabad"; // Your Account SID from www.twilio.com/console
  var authToken = "623897efa937750e5c356037d62613ab"; // Your Auth Token from www.twilio.com/console

  var twilio = require("twilio");
  var client = new twilio(accountSid, authToken);

  client.messages
    .create({
      body:
        "Your Verification no. is " +
        (Math.floor(Math.random() * (99999 - 10000)) + 10000),
      to: "+639998566541", // Text this number
      //   to: "+639282150443", // Text this number
      from: "+12029337079", // From a valid Twilio number
    })
    .then((message) => res.send({ result: message.sid }))
    .catch((err) => {
      res.send({ message: err });
    });
});

//require Routes
// require("./routes/bundle_routes")(app);
// require("./routes/getter_routes")(app);
// require("./routes/supplier_routes")(app);
// require("./routes/stock_control_routes")(app);
// require("./routes/setter_routes")(app);
// require("./routes/event_routes")(app);
// require("./routes/product_routes")(app);

// //connecting to MongoDB Database
// mongoose.connect(keys.mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });
// mongoose.set("debug", async (collectionName, method, query, doc) => {
//   var fs = require("fs");

//   var data2 = ``;
//   if (method == "find") {
//   } else {
//     var data = `${collectionName}.${method} ---|| ${JSON.stringify(
//       query
//     )} ||--- ${new Date()}\n`;
//     fs.appendFileSync("logs.dat", data);
//   }

//   // console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
// });
// look for process.env.PORT for port or else use 5001 as port
const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log("Listening to Port " + PORT);
});
