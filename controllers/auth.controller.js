const User = require('../models/User');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const response = require('../utils/response');
const { signToken, cookieOptions } = require('../utils/jwt');
const { BCRYPT_SALT_ROUNDS } = require('../constants/app');

class AuthController {
  static async register(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().min(2).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    try {
      const { error, value } = schema.validate(req.body);

      if (error) return response(res, 422, error.details[0].message);

      // Get user info from request body stored in joi value
      const { name, email, password } = value;

      // Check if the email exists in the database already
      const userExists = await User.findOne({ email });
      if (userExists) return response(res, 409, 'Email already registered');

      // Hash the password
      const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);

      // create a new user from the request body
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        isVerified: false,
      });

      const token = signToken({ id: user._id });

      // set cookie
      res.cookie('token', token, cookieOptions);

      // return safe user
      const safeUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        rating: user.rating,
        createdAt: user.createdAt,
      };

      return response(res, 201, 'User registered successfully', {
        token,
        user: safeUser,
      });
    } catch (error) {
      next(err);
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
