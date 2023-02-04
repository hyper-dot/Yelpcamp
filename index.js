if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressErrors");
const campgroundsRoute = require("./Routes/campground");
const authRoute = require("./Routes/auth");
const reviewsRoute = require("./Routes/reviews");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");

//Mongodb Connection
const URI = "mongodb://127.0.0.1:27017/Yelpcamp";
mongoose.connect(URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error!!"));
db.once("open", () => {
  console.log("Connection Open!!");
});

//All app settings
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// all Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// app.use('/public/images', express.static('./public/images'));
app.use(express.static(path.join(__dirname, "./public")));

const sessionConfig = {
  secret: "This secret be a actual secret!!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//All Routes
app.use("/", authRoute);
app.use("/campgrounds", campgroundsRoute);
app.use("/campgrounds/:id/reviews", reviewsRoute);

//...................Home route...................
app.get("/", (req, res) => {
  res.render("home");
});

//...............For all routes that doesn't exists...........................
app.all("*", (req, res, next) => {
  err = new ExpressError("Page not found", 404);
  next(err);
});

//Error Handler
app.use((err, req, res, next) => {
  const { message = "something went wrong", statusCode = 500 } = err;
  res.status(statusCode).render("error", { err });
});

//App is listening to port 3000
app.listen(3000, () => {
  console.log("Listening to port 3000");
});
