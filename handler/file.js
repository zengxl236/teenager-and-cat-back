const db = require("../db");
const fs = require("fs");
const path = require("path");

module.exports = {
  exists_handler: (req, res) => {
    const { hash, size } = req.query;
    const sql = "select id from file where hash=? and size=? and is_delete=0";
    db.query(sql, [hash, size], (err, results) => {
      if (err) {
        throw new Error("连接数据库失败");
      }

      if (results.length) {
        res.send({
          code: 200,
          message: "该文件已上传",
          data: true,
        });
        return;
      }

      const dirPath = path.join(__dirname, `../file/${hash}_${size}`);

      if (!fs.existsSync(dirPath)) {
        res.send({
          code: 200,
          message: "该文件未上传上传",
          data: [],
        });
        return;
      }

      const files = fs.readdirSync(dirPath);

      res.send({
        code: 200,
        message: "该文件未上传上传",
        data: files.map((file) => file.name.split(".")[0]),
      });
    });
  },
};
