const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
  static async register(req, res) {
    try {
      // Get user info from request body
      const { name, email, password } = req.body;

      // Check if the email exists in the database already
      const checkExisitingUser = await User.findOne({ email });
      if (checkExisitingUser) {
        return res.status(400).json({
          success: false,
          message:
            'User with the same email already exists. Please try with a different email',
        });
      }

      // Hash the password
      const salt = bcrypt.genSalt(10);
      const hashedPassword = bcrypt.hash(password, salt);

      // create a new user from the request body
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        isVerified: false,
      });

      // store the user info in the database
      await newUser.save();

      if (newUser) {
        res.status(201).json({
          success: true,
          message: 'User created successfully',
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Unable to register user. Please try again',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again',
      });
    }
  }
  static async login(req, res) {
    // Create a token using jwt.sign
    try {
      // Get email and password from the user
      const { email, password } = req.body;

      // Use email to find the particular user
      const user = await User.findOne({ email });

      // check if email does not exist and return error
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'User does not exist',
        });
      }

      // Compare password passed in request body with the one from the database(user.password)
      const isPasswordMatching = bcrypt.compare(password, user.password);

      if (!isPasswordMatching) {
        return res.status(400).json({
          success: false,
          message: 'invalid Credentials!',
        });
      }

      // create a token
      const accessToken = jwt.sign(
        {
          userId: user._id,
          name: user.name,
          isVerified: user.isVerified,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: '30m',
        }
      );
      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        accessToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again',
      });
    }
  }
  static async me(req, res) {
    res.json({
      message: 'Welcome to the Profile route',
    });
  }
}

module.exports = AuthController;
