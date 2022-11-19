const express = require("express");
const router = express.Router();
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderControler");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/me/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/order/me").get(isAuthenticatedUser, myOrders);

router
  .route("/order/all")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getAllOrder);

router
  .route("/order/updateOrderStatus/:id")
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateOrderStatus);

router
  .route("/order/deleteOrder/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteOrder);

module.exports = router;
