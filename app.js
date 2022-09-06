const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const URI = 'mongodb://127.0.0.1:27017/Yelpcamp';
mongoose.connect(URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error!!'));
db.once('open', () => {
  console.log('Connection Open!!');
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
});
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.listen(3000, () => {
  console.log('Listening to port 3000');
});
