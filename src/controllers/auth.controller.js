const Io = require("../utils/io");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const path = require("path");
const Joi = require("joi");
const jwt = require("jsonwebtoken")
const { v4: uuid } = require("uuid");
const { error } = require("console");
const config = require("../../config");

const usersDB = new Io(`${process.cwd()}/database/users.json`);

const login = async (req, res) => {
  try {
    const { username, password, status } = req.body;

    const check = Joi.object({
      username: Joi.string().min(5).required(),
      password: Joi.string().min(6).required(),
      status: Joi.string().valid("active", "inactive"),
    });

    const { error } = check.validate({ username, password, status });
    if (error) return res.status(400).json({ message: error.message });
    const users = await usersDB.read();
    const findUser = users.find((user) => user.username === username);

    if (!findUser)
      return res
        .status(403)
        .json({ message: "Incorrect username or password" });

    const verify = await bcrypt.compare(password, findUser.password);
    if (!verify) return res.json({ message: "Incorrect username or password" });

    const token = jwt.sign({id: findUser.id, username: findUser.username}, config.jwt_key, { expiresIn: config.jwt_expires_in });

    res.json({ message: "You are successfully logged in", data: token });
  } catch (error) {
    // res.status(500).json({ message: "Internal Server error" });
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { fullname, username, password } = req.body;

    const { photo } = req.files;
    const users = await usersDB.read();

    const findUser = users.find((user) => user.username === username);

    if (findUser)
      return res.status(403).json({ message: "username already registered" });

    const hashedPass = await bcrypt.hash(password, 10);
    const photoName = `${uuid()}${path.extname(photo.name)}`;

    photo.mv(`${process.cwd()}/uploads/${photoName}`);

    const newUser = new User(fullname, username, hashedPass, photoName);
    users.push(newUser);
    await usersDB.write(users);
    // console.log(newUser);

    const token = jwt.sign({id: newUser.id}, config.jwt_key, { expiresIn: config.jwt_expires_in });

    res.json({ message: "Success", data: newUser , token});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
    // res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  register,
};
