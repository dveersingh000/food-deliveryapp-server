const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

// register a new user
router.post("/signup", async (req, res) => {
    const { name, phoneNumber, email, password } = req.body;
    const ifUserExists = await User.findOne({ email });
    if (ifUserExists) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        phoneNumber,
        email,
        password: hashedPassword
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
});

//get all users
router.get(("/"), async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
});

//get user by email
router.get(("/:email"), async (req, res) => {
    const { email } = req.params;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
});

//login user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Wrong email or password" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({ message: "Wrong email or password" });
    }
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
});
    
//update user
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, phoneNumber, email, password } = req.body;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (name) {
        user.name = name;
    }
    if (phoneNumber) {
        user.phoneNumber = phoneNumber;
    }
    if (email) {
        user.email = email;
    }
    if (password) {
        user.password = password;
    }
    await user.save();
    res.status(200).json({ user });
});

module.exports = router;