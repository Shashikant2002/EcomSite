const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  forgetPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getUserDetail,
  updateRole,
  deleteUser,
} = require("../controllers/userControler");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forget").post(forgetPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/updateProfile").put(isAuthenticatedUser, updateProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getAllUser);

router
  .route("/admin/users/:id")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getUserDetail);

router
  .route("/admin/role/:id")
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateRole);

router
  .route("/admin/users/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteUser);

module.exports = router;
