module.exports = {
  login_schema: (req, res, next) => {
    const usernameReg = /^[a-zA-Z0-9]{5,16}$/;
    const passwordReg = (str) => str.length >= 5 && str.length <= 16;

    const { username, password } = req.body;

    if (!usernameReg.test(username) || !passwordReg(password)) {
      throw new Error("账号或密码格式错误");
    }

    next();
  },
};
