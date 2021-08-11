const express = require("express");
const { handleError } = require("../middleware/errorHandler");
const { retrieveTokenInfo } = require("../middleware/authWare");

const router = express.Router();

const controller = require("../controller/authController");

router.get("/login", (req, res) => {
  res.status(200).render("login");
});

router.get("/createPW", controller.createPW);

router.post("/login", controller.login_post);

router.post("/user/create", retrieveTokenInfo, controller.createUser_post);

router.post("/user/delete", retrieveTokenInfo, controller.delProfile_post);

module.exports = router;
