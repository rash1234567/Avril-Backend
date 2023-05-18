const errorHandlerMiddleware = (err, req, res, next) => {
  res.status(500).json({ msg: "Server error" });
};

module.exports = errorHandlerMiddleware;
