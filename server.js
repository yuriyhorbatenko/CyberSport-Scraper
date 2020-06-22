
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://user:password1@ds117806.mlab.com:17806/heroku_h5mmfc6b";

var PORT = process.env.PORT || 8080;
var app = express();

app.use(express.static("public"));
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', exphbs({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set("view engine", "handlebars");

mongoose.connect(MONGODB_URI);

var routes = require("./routes/routes.js");

app.use(routes);

app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:" + PORT + "!");
});
