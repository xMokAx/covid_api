const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 20,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("Users", userSchema);

exports.findByEmail = async (email) => {
  const user = await User.findOne({ email: email }, "-__v");
  return user.toObject();
};

exports.findById = async (id) => {
  const user = await User.findById(id).select("-__v");
  return user.toObject();
};

exports.createUser = (userData) => {
  const user = new User(userData);
  return user.save();
};
