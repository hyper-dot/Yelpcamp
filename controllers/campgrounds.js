const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};
module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully made a campground !!!");
  res.redirect(`campgrounds/${campground._id}`);
};
module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Opps cannot find the campground!!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};
module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  await campground.save();
  req.flash("success", "Successfully Updated campground !!!");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Opps cannot find the campground!!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the campground !!");
  res.redirect("/campgrounds");
};
