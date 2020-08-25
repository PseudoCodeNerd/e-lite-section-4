var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require('express-ejs-layouts');
require("dotenv").config();
var indexRouter = require("./routes/index");
var dweetRouter = require("./routes/dweets");
var dweetListRouter = require("./routes/dweetlist")
var compression = require('compression');
var helmet = require('helmet');
var app = express();
app.use(helmet());
var mongoose = require("mongoose");
var mongoDB = `mongodb+srv://god:${process.env.PSWD}@dweeter-ex4.xkhgv.gcp.mongodb.net/${process.env.NAME}?retryWrites=true&w=majority`;
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;
    console.log("MongoDB connection established.");
  }
);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts)
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression()); //Compress all routes

app.use("/", indexRouter);
app.use("/dweet", dweetRouter);
app.use("/dweets", dweetListRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
