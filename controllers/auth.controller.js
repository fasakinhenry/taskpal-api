const User = require('../models/User');
const bcrypt = require('bcryptjs');

class AuthController {
  static async register(req, res) {
    // store the user info in the database
    // Return the status of events to the client
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
    // Get email and password from the user
    // Use email to find the particular user
    // check if email does not exist and return error
    // If email exists, we then check for password
    // Compare password passed in request body with the one from the database(user.password)
    // if password match, return success response
    // else, return error - bad request 400
    // Create a token using jwt.sign
  }
  static async me(req, res) {
    res.json({
      message: 'Welcome to the Profile route',
    });
  }
}

module.exports = AuthController;
