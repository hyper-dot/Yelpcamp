const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const URI = 'mongodb://127.0.0.1:27017/Yelpcamp';
const ejsMate = require('ejs-mate');

//Mongodb Connection
mongoose.connect(URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error!!'));
db.once('open', () => {
  console.log('Connection Open!!');
});

//All app settings
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// all Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public/images'));
app.use('/public/images', express.static('./public/images'));

//All Routes

//...................Home route...................
app.get('/', (req, res) => {
  res.render('home');
});

//...................All Campgrounds..................
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

//....................New Campground.....................
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`campgrounds/${campground._id}`);
});

//......................Show campground.................
app.get('/campgrounds/:id', async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', { campground });
});

//...................Edit campground..............
app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
});

//................Delete Campground...............
app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
});

app.listen(3000, () => {
  console.log('Listening to port 3000');
});
