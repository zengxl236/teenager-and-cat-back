const express = require("express");
const router = express.Router();

const { exists_schema } = require("../schema/file");
const { exists_handler } = require("../handler/file");

// 登录接口
router.get("/exists", exists_schema, exists_handler);

module.exports = router;
