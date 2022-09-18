const express = require("express");
const router = express.Router();

const { login_schema } = require("../schema/user");
const { login_handler } = require("../handler/user");

// 登录接口
router.post("/login", login_schema, login_handler);

module.exports = router;
