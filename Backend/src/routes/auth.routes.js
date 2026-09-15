const { Router } = require("express");

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const googleOAuth2Client = require("../config/googleOAuth");

const authRouter = Router();

/**
 * @route POST /register
 * @description Register a new user
 * @access Public
 */

authRouter.post(
  "/register",
  authController.registerUserController
);


/**
 * @route POST /login
 * @description Login user
 * @access Public
 */

authRouter.post(
  "/login",
  authController.loginUserController
);


/**
 * @route GET /logout
 * @description Logout user
 * @access Public
 */

authRouter.get(
  "/logout",
  authController.logoutUserController
);


/**
 * @route GET /getMe
 * @description Get logged-in user
 * @access Private
 */

authRouter.get(
  "/getMe",
  authMiddleware.authUser,
  authController.getMeController
);


/**
 * Google OAuth
 */

// Step 1: Redirect user to Google
authRouter.get("/google", (req, res) => {

  const authUrl = googleOAuth2Client.generateAuthUrl({
    access_type: "offline",

    scope: [
      "openid",
      "email",
      "profile",
    ],

    prompt: "select_account",
  });

  res.redirect(authUrl);
});


// Step 2: Google redirects back here
authRouter.get(
  "/google/callback",
  authController.googleCallbackController
);


module.exports = authRouter;