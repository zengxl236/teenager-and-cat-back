const express = require("express");
const cors = require("cors");

const app = express();

// 序列化 跨域
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 解析 token
const { expressjwt } = require("express-jwt");
const { secret } = require("./config/jwt");
app.use(
  expressjwt({ secret, algorithms: ["HS256"] }).unless({
    path: [/\/login$/],
  })
);

// api
const userRouter = require("./router/user");
const fileRouter = require("./router/file");
app.use("/user", userRouter);
app.use("/file", fileRouter);

// error
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.send({ code: 401, message: "登录过期" });
    return;
  }

  res.send({ code: 500, message: err.message });
});

app.listen(8080, () => {
  console.log("http//:localhost:8080");
});
