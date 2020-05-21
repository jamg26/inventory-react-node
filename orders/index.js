const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
const keys = require("./config/keys");

const bodyParser = require("body-parser");

const app = express();
app.use(compression());
var cors = require("cors");
app.use(bodyParser.json({ limit: "50mb" }));
//require models
require("./model");
//apply CORS middleware
app.use(cors());
//require Routes
require("./routes/getter_routes")(app);
require("./routes/setter_routes")(app);
require("./routes/event_routes")(app);
require("./routes/product_routes")(app);

//connecting to MongoDB Database
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
// look for process.env.PORT for port or else use 5001 as port
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log("Listening to Port " + PORT);
});
