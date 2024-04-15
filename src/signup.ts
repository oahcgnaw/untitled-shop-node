import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

router.post("/", async (req, res) => {
  let check = await User.findOne({ email: req.body.email });
  if (check) {
    res.status(400).json({
      success: false,
      error: "User already exists",
    });
  }
  let cart = {};
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret-ecom");
  res.json({
    success: true,
    token,
  });
});

export default router;
