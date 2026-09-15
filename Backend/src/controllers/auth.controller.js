const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");
const { google } = require("googleapis");
const googleOAuth2Client = require("../config/googleOAuth");

async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide username, email and password",
    });
  }

  const userAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (userAlreadyExist) {
    return res.status(400).json({
      message: "Account already exists with this email or username",
    });
  }
  const hash = await bcrypt.hash(password, 12);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User Registered Successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid Email or Password",
    });
  }
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({
      message: "Invalid Password",
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  res.cookie("token", token);

  res.status(200).json({
    message: "User LoggedIn Successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if (token) {
    await tokenBlacklistModel.create({ token });
  }

  res.clearCookie("token");

  res.status(200).json({
    message: "User logged out successfully",
  });
}

async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: "User details fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function googleCallbackController(req, res) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
      );
    }

    // Exchange authorization code for Google tokens
    const { tokens } = await googleOAuth2Client.getToken(code);

    googleOAuth2Client.setCredentials(tokens);

    // Get Google user information
    const oauth2 = google.oauth2({
      auth: googleOAuth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();

    const { id: googleId, email, name, picture } = data;

    if (!email) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_email`);
    }

    // Find existing user by email
    let user = await userModel.findOne({ email });

    // Create new user
    if (!user) {
      const baseUsername = (name || "user").replace(/\s+/g, "").toLowerCase();

      let username = baseUsername;

      // Make username unique
      let usernameExists = await userModel.findOne({ username });

      while (usernameExists) {
        username = baseUsername + Math.floor(1000 + Math.random() * 9000);

        usernameExists = await userModel.findOne({ username });
      }

      user = await userModel.create({
        username,
        email,
        googleId,
        profilePicture: picture,
      });

      console.log("Google user created:", user.email);
    } else {
      // Existing user
      // Link Google account if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
      }

      // Update profile picture
      if (picture) {
        user.profilePicture = picture;
      }

      await user.save();

      console.log("Existing user logged in:", user.email);
    }

    // Generate application JWT
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // Store JWT in cookie
    res.cookie("token", token);

    console.log("JWT cookie created");

    // Redirect to frontend
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error("Google OAuth Error:", error);

    return res.redirect(
      `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
    );
  }
}


module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
  googleCallbackController,
};
