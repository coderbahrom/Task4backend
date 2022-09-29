const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    console.log(err, err.message);
  }
};

exports.getUsers = getUsers;

const createUser = async (req, res, next) => {
  console.log("createUse", console.log(req.body));
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  });
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(password, salt);
  await user.save().then((res) => {
    console.log("User saved");
  });
  return res.status(200).json(user);
};

const postLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);
  let user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).send("Email or password not found");
  }
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(400).send("Email or password not found");
  }

  const token = jwt.sign({ _id: user._id }, "4adawdadnGHsjks1");
  return res.status(200).json({ token, user });
};
const deleteUser = (req, res) => {
  try {
    let userIdList = req.body;
    console.log(userIdList);
    let isValidUser = userIdList.find((id) => id === req.user._id);

    userIdList.forEach((item) => {
      console.log("deleteUser", item);
      User.findByIdAndDelete(item).then((user) => {
        if (!user) {
          return res.status(404).json("User not found");
        }
      });
    });

    return res.status(200).json({
      message: "User deleted",
      isValidUser: isValidUser ? true : false,
    });
  } catch (e) {
    console.log("error", e, e.message);
  }
};
const unLockUser = async (req, res) => {
  try {
    let userIdList = req.body;
    let isValidUser = userIdList.find((id) => id === req.params.id);

    console.log(isValidUser, "issssss");
    userIdList.forEach(async (userId) => {
      let userCheck = await User.findById(userId);
      if (!userCheck) {
        return res.status(404).json("User not found");
      }
      let user = await User.findByIdAndUpdate(
        userId,
        {
          status: false,
        },
        {
          new: false,
        }
      );

      user.save();
    });
    return res
      .status(200)
      .json({ message: "success", isValidUser: isValidUser ? true : false });
  } catch (e) {
    console.log("error", e, e.message);
  }
};
const blockUser = async (req, res) => {
  let userIdList = req.body;
  let isValidUser = userIdList.find((id) => id === req.params.id);
  console.log(req, "issssss");

  console.log(req.body, "blockUser");
  userIdList.forEach(async (userId) => {
    let userCheck = await User.findById(userId);
    console.log(userCheck, "userCheck");
    if (!userCheck) {
      return res.status(404).json("User not found");
    }
    let user = await User.findByIdAndUpdate(
      userId,
      {
        status: true,
      },
      {
        new: true,
      }
    );
    user.save();
  });
  return res
    .status(200)
    .json({ message: "success", isValidUser: isValidUser ? true : false });
};
exports.unLockUser = unLockUser;
exports.blockUser = blockUser;
exports.deleteUser = deleteUser;
exports.postLogin = postLogin;
exports.createUser = createUser;
