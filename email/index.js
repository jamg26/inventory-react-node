const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
const keys = require("./config/keys");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");

const app = express();
app.use(compression());
var cors = require("cors");
app.use(bodyParser.json({ limit: "50mb" }));
app.set("view engine", "pug");
//require models
require("./model");
//apply CORS middleware
app.use(cors());
app.use(
  fileUpload({
    createParentPath: true,
  })
);
//require Routes
require("./routes/retreive_email_routes")(app);
require("./routes/getter_routes")(app);
require("./routes/setter_routes")(app);

//connecting to MongoDB Database
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.set("debug", async (collectionName, method, query, doc) => {
  var fs = require("fs");

  var data2 = ``;
  if (method == "find") {
  } else {
    var data = `${collectionName}.${method} ---|| ${JSON.stringify(
      query
    )} ||--- ${new Date()}\n`;
    fs.appendFileSync("logs.dat", data);
  }

  // console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
});
// look for process.env.PORT for port or else use 5001 as port
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log("Listening to Port " + PORT);
});
