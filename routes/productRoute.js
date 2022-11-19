const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  addReview,
  getProductReviews,
  deleteReviews,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

// Product Routes
router.route("/products").get(getAllProducts);

router.route("/products/:id").get(getSingleProduct);

router.route("/reviews").put(isAuthenticatedUser, addReview);

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("Admin"), createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateProduct);

router
  .route("/admin/product/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteProduct);

router.route("/product/reviews").get(getProductReviews);

router.route("/product/reviews").delete(isAuthenticatedUser, deleteReviews);

module.exports = router;
