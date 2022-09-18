const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/jwt");

module.exports = {
  login_handler: (req, res) => {
    const { username, password } = req.body;
    const sql = "select id,password from user where username=? and is_delete=0";
    db.query(sql, username, (err, results) => {
      if (err) {
        throw new Error("连接数据库失败");
      }

      if (!results.length) {
        throw new Error("不存在该用户");
      }

      const [user] = results;
      const loginFlag = bcrypt.compareSync(password, user.password);
      if (!loginFlag) {
        throw new Error("账号或密码错误");
      }

      delete user.password;
      const token = "Bearer " + jwt.sign({ ...user }, secret, { expiresIn });
      res.send({
        code: 200,
        message: "登陆成功",
        data: { token, id: user.id },
      });
    });
  },
};
