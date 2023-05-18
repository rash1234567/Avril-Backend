const User = require("../models/User");
const bcrypt = require("bcrypt");
const loginValidation = require("../validation/loginValidation");
const regValidation = require("../validation/registrationValidation");
const crypto = require("crypto");

const generateWalletAddress = () => {
  const walletAddress = crypto.randomBytes(20).toString("hex").toUpperCase();
  return walletAddress;
};

const registerUser = async (req, res) => {
  const { error } = regValidation(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  const isExisting = await User.findOne({ email: req.body.email });
  if (isExisting) {
    return res.send("Email already exists");
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = await new User({
      email: req.body.email,
      password: hashedPassword,
      walletAddress: generateWalletAddress(),
    });

    user.save();
    res.status(200).send({ message: "user created sucessfully", user: user });
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { error, value } = loginValidation(req.body);
  if (error) {
    return res.status(401).send({ message: error.details[0].message });
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(401).send({ message: "invalid credentials" });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return res.status(401).send({ message: "invalid credentials" });
    }
    const token = user.createJWT();
    console.log(isPasswordCorrect);
    res
      .status(200)
      .send({ message: "login sucessful", token: token , user:user});
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
};


const updateAccount = async (req, res) => {
  try {
    const { email, password, profession, about } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.email = email;
    user.profession = profession;
    user.about = about;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    await user.save();

    res
      .status(200)
      .send({ message: "Account updated successfully", user: user });
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
};

module.exports = { registerUser, login, updateAccount };
