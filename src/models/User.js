const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email must be provided"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password must be provided"],
  },
  walletAddress: {
    type: String,
  },
  profession: {
    type: String,
  },
  about: {
    type: String,
  },
});

userSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: "200h",
  });
};

userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
