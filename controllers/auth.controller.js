const User = require('../models/User');

class AuthController {
  static async register(req, res) {
    // Get user info from request body
    // Check if the email exists in the database already
    // Hash the password
    // store the user info in the database
    // Return the status of events to the client
    try {
      
    } catch (error) {
      console.log(error);
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
      message: "Welcome to the Profile route"
    })
  }
}

module.exports = AuthController;
