const User = require("../models/User");
const Freelancer = require("../models/Freelancer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const generateToken = (userId, role, secret, expiresIn) =>
  jwt.sign({ userId, role }, secret, { expiresIn });

// ==================== Register USER ====================
exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });

    const accessToken = generateToken(
      user.id,
      "user",
      process.env.JWT_ACCESS_SECRET,
      process.env.ACCESS_TOKEN_EXPIRY
    );
    const refreshToken = generateToken(
      user.id,
      "user",
      process.env.JWT_REFRESH_SECRET,
      process.env.REFRESH_TOKEN_EXPIRY
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "user",
      },
    });
  } catch (err) {
    next(err);
  }
};

// ==================== Register FREELANCER ====================
exports.registerFreelancer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  try {
    const existing = await Freelancer.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const freelancer = await Freelancer.create({
      name,
      email,
      password: hashed,
    });

    const accessToken = generateToken(
      freelancer.id,
      "freelancer",
      process.env.JWT_ACCESS_SECRET,
      process.env.ACCESS_TOKEN_EXPIRY
    );
    const refreshToken = generateToken(
      freelancer.id,
      "freelancer",
      process.env.JWT_REFRESH_SECRET,
      process.env.REFRESH_TOKEN_EXPIRY
    );

    freelancer.refreshToken = refreshToken;
    await freelancer.save();

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: freelancer.id,
        name: freelancer.name,
        email: freelancer.email,
        role: "freelancer",
      },
    });
  } catch (err) {
    next(err);
  }
};

// ==================== LOGIN ====================
exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    let role = "user";

    if (!user) {
      user = await Freelancer.findOne({ email });
      role = "freelancer";
    }

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateToken(
      user.id,
      role,
      process.env.JWT_ACCESS_SECRET,
      process.env.ACCESS_TOKEN_EXPIRY
    );
    const refreshToken = generateToken(
      user.id,
      role,
      process.env.JWT_REFRESH_SECRET,
      process.env.REFRESH_TOKEN_EXPIRY
    );

    user.refreshToken = refreshToken;
    await user.save();

    if (user.role === "freelancer") {
      return res.json({
        accessToken,
        refreshToken,
        freelancer: {
          id: user.id,
          name: user.name,
          email: user.email,
          skills: user.skills,
          categories: user.categories,
          experience: user.experience,
          availability: user.availability,
          hourlyRate: user.hourlyRate,
          role: user.role,
          // location: user.location,
          // languages: user.languages,
          // education: user.education,
          // certifications: user.certifications,
          // socialLinks: user.socialLinks,
          profileCompleted: user.profileCompleted,
        },
      });
    } else {
      return res.json({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

// ==================== REFRESH ====================
exports.refreshToken = async (req, res, next) => {
  const { token } = req.body;
  if (!token)
    return res.status(400).json({ message: "Refresh token required" });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    let user =
      payload.role === "user"
        ? await User.findById(payload.userId)
        : await Freelancer.findById(payload.userId);

    if (!user || user.refreshToken !== token)
      return res.status(403).json({ message: "Forbidden" });

    const accessToken = generateToken(
      user.id,
      payload.role,
      process.env.JWT_ACCESS_SECRET,
      process.env.ACCESS_TOKEN_EXPIRY
    );

    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

// ==================== FETCH CURRENT USER ====================
exports.fetchUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user, // already has password excluded
    });
  } catch (err) {
    console.error("Fetch user error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
a;
// ==================== LOGOUT ====================
exports.logout = async (req, res, next) => {
  const { token } = req.body;

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const model = payload.role === "user" ? User : Freelancer;

    await model.findByIdAndUpdate(payload.userId, { refreshToken: null });
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};
