const Product = require("../models/productModel");
const ErrorHandeler = require("../utils/errorHandeler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

// create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// get All Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  // return next(new ErrorHandeler("Product Not Found", 500));
  const resultPerPage = 6;
  let productCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    
    let product = await apiFeatures.query;
    let filteredProduct = product.length;

    console.log(product.length)

  res.status(200).json({
    success: true,
    product,
    productCount,
    resultPerPage,
    filteredProduct,
  });
});

// get Single Product
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  // return next(new ErrorHandeler("Product Not Found", 500));
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandeler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// update Product -- Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandeler("Product Not Found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Product Updated SuccessFully",
    product,
  });
});

// Delete Product -- Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandeler("Product Not Found", 404));
  }
  await Product.remove();
  res.status(200).json({
    success: true,
    message: "Product Deleted SuccessFully",
    product,
  });
});

// create New Review and Update the review
exports.addReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    product,
  });
});

// All Reviews of Single Product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandeler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Reviews of Single Product
exports.deleteReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandeler("Product Not Found", 404));
  }
  const review = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;
  review.forEach((rev) => {
    avg += rev.rating;
  });
  const rating = avg / review.length;
  const numOfReviews = review.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews: review,
      rating: rating,
      numberOfReviews: numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Reviews Deleted Successful",
  });
});
