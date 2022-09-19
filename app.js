const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const URI = 'mongodb://127.0.0.1:27017/Yelpcamp';
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/CatchAsync');
const ExpressError = require('./utils/ExpressErrors');
const { validateCampground } = require('./utils/validateCampground');
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
app.get(
  '/campgrounds',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

//....................New Campground.....................
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.post(
  '/campgrounds',
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
  })
);

//......................Show campground.................
app.get(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
  })
);

//...................Edit campground..............
app.put(
  '/campgrounds/:id',
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get(
  '/campgrounds/:id/edit',
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
  })
);

//................Delete Campground...............
app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  })
);

//For all routes that doesn't exists
app.all('*', (req, res, next) => {
  err = new ExpressError('Page not found', 404);
  next(err);
});

//Error Handler
app.use((err, req, res, next) => {
  const { message = 'something went wrong', statusCode = 500 } = err;
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log('Listening to port 3000');
});
