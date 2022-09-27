const db = require("../db");
const fs = require("fs");
const path = require("path");
const multiparty = require("multiparty");

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
          message: "该文件未上传",
          data: [],
        });
        fs.mkdirSync(dirPath);
        return;
      }

      const files = fs.readdirSync(dirPath);
      res.send({
        code: 200,
        message: "该文件部分上传",
        data: files.map((file) => file.name.split(".")[0]),
      });
    });
  },

  upload_handler: (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
      if (err) {
        throw new Error("获取数据失败");
      }

      const hash = fields.hash[0];
      const size = fields.size[0];
      const name = fields.name[0];
      const chunks = fields.chunks[0];
      const chunkIdx = fields.chunkIdx[0];
      const currentHash = fields.currentHash[0];
      const file = files.file[0];

      const dirPath = path.join(
        __dirname,
        `../file/${hash}_${size}`,
        `${chunkIdx}.temp`
      );

      fs.writeFileSync(dirPath, file);

      res.send({
        code: 200,
        message: "分片上传成功",
        data: null,
      });
    });
  },
};
