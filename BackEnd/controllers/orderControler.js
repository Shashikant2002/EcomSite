const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const ErrorHandeler = require("../utils/errorHandeler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create New Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItem,
    paymentInfo,
    itemPrice,
    taxPrice,
    shipingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItem,
    paymentInfo,
    itemPrice,
    taxPrice,
    shipingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  const user = await User.findById(order.user);

  if (!order) {
    return next(new ErrorHandeler("Order not Found With This Id", 404));
  }

  console.log(user.name);

  res.status(200).json({
    success: true,
    order,
    user,
  });
});

// Get logedin user Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get All Orders
exports.getAllOrder = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update order Status
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandeler("Order not Found With This Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandeler("Already Delevered This Product", 404));
  }

  order.orderItem.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
  });
});

const updateStock = async (id, quantity) => {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
};

// Delete Orders
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandeler("Order not Found With This Id", 404));
  }
  await order.remove();

  res.status(200).json({
    success: true,
  });
});
