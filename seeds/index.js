const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const URI = "mongodb://127.0.0.1:27017/Yelpcamp";
mongoose.connect(URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error!!"));
db.once("open", () => {
  console.log("Connection Open!!");
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 5; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const random5 = Math.floor(Math.random() * 5);
    const camp = new Campground({
      author: "63ddf0e6a6d4e3c7f398824c",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      description:
        "Description is the pattern of narrative development that aims to make vivid a place, object, character, or group.[1] Description is one of four rhetorical modes (also known as modes of discourse), along with exposition, argumentation, and narration.",
      images: `${random5}.jpg`,
      price: `${random1000}`,
    });
    await camp.save();
  }
};
seedDb().then(() => {
  db.close();
});
