const db = require("../db");
const fs = require("fs");
const path = require("path");
const multiparty = require("multiparty");

const getTmpDirPath = (hash) => path.join(__dirname, `../file/tmp/${hash}`);
const getDirPath = (hash) => path.join(__dirname, `../file/${hash}`);
const getChunkPath = (hash, name) =>
  path.join(__dirname, `../file/tmp/${hash}/name`);

module.exports = {
  exists_handler: (req, res) => {
    const { hash } = req.query;
    const sql = "select id from file where hash=? and is_delete=0";
    db.query(sql, hash, (err, results) => {
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

      const dirPath = getTmpDirPath(hash);
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
        data: files.map((name) => name.split("_")[0]),
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

      const dirPath = getTmpDirPath(hash);
      const filePath = path.join(dirPath, `${chunkIdx}_${name}`);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      fs.renameSync(file.path, filePath);
      const dirFiles = fs.readdirSync(dirPath);

      if (dirFiles.length === chunks) {
        const stream = fs.createWriteStream(getDirPath(hash), name);

        dirFiles.forEach((name) => {
          const chunkStream = fs.createReadStream(getChunkPath(hash, name));
          chunkStream.pipe(stream);
        });
      }

      res.send({
        code: 200,
        message: "分片上传成功",
        data: null,
      });
    });
  },
};
