module.exports = {
  exists_schema: (req, res, next) => {
    const { hash, size } = req.query;

    const error = [];

    if (!hash) error.push("hash");
    if (!size) error.push("size");

    if (error.length) {
      throw new Error(`${error.join(", ")}参数不能为空`);
    }

    next();
  },
};
