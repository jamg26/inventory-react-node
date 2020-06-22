const express = require("express");
const mongoose = require("mongoose");

const keys = require("./config/keys");

const bodyParser = require("body-parser");

const app = express();
var cors = require("cors");
app.use(bodyParser.json({ limit: "50mb" }));
//require models
require("./model");
//apply CORS middleware
app.use(cors());
//require Routes
require("./routes/user_routes")(app);
require("./routes/staff_routes")(app);

require("./routes/getter_routes")(app);

//connecting to MongoDB Database
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
// look for process.env.PORT for port or else use 7001 as port
const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
  console.log("Listening to Port " + PORT);
});
