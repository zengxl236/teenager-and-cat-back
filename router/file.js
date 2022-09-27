const express = require("express");
const router = express.Router();

const { exists_schema } = require("../schema/file");
const { exists_handler, upload_handler } = require("../handler/file");

// 查看文件是否上传 上传片段接口
router.get("/exists", exists_schema, exists_handler);
// 分片上传接口
router.post("/upload", upload_handler);

module.exports = router;
