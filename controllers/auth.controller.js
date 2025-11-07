const User = require('../models/User');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const response = require('../utils/response');
const { signToken, cookieOptions } = require('../utils/jwt');
const { BCRYPT_SALT_ROUNDS } = require('../constants/app');

class AuthController {
  // POST /api/auth/register
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
      next(error);
    }
  }

  // POST /api/auth/login
  static async login(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    try {
      const { error, value } = schema.validate(req.body);

      if (error) return response(res, 422, error.details[0].message);

      // Get email and password from the user
      const { email, password } = value;

      // Use email to find the particular user
      const user = await User.findOne({ email });

      // check if email does not exist and return error
      if (!user) return response(res, 401, 'Invalid credentials');

      // Compare password passed in request body with the one from the database(user.password)
      const isPasswordMatching = await bcrypt.compare(password, user.password);

      if (!isPasswordMatching) return response(res, 401, 'Invalid credentials');

      // create a token
      const token = signToken({ id: user._id });
      res.cookie('token', token, cookieOptions);

      const safeUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        rating: user.rating,
        createdAt: user.createdAt,
      };

      return response(res, 200, 'Logged in successfully', {
        token,
        user: safeUser,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/logout
  static async logout(req, res, next) {
    try {
      // clear cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });
      return response(res, 200, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  // GET /api/auth/me
  static async me(req, res, next) {
    try {
      if (!req.user) return response(res, 401, 'Unauthorized');
      return response(res, 200, 'User fetched', { user: req.user });
    } catch (error) {
      next(error);
    }
  }

  // Placeholder for Google OAuth (version 2)
  static async googleOAuthPlaceholder(req, res, next) {
    try {
      console.log('Google Auth coming soon');
      return response(res, 501, 'Google OAuth coming soon');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
