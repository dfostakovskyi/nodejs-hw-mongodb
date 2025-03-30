// src\controllers\auth.js

import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';

import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from '../services/auth.js';

import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendMail.js';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';

export const registerUserController = async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await registerUser({ name, email, password });

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken } = await loginUser({ email, password });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: { accessToken },
  });
};

export const refreshSessionController = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createHttpError(401, 'No refresh token provided');
  }

  const { accessToken, newRefreshToken } = await refreshSession(refreshToken);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      status: 401,
      message: 'No refresh token provided',
    });
  }

  try {
    await logoutUser(refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Logout failed',
      error: error.message,
    });
  }
};

export const sendResetEmailController = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  const frontendDomain = process.env.FRONTEND_DOMAIN;
  const resetPasswordUrl = `${frontendDomain}/reset-password?token=${token}`;

  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Password',
      text: `Please reset your password using the following link: ${resetPasswordUrl}`,
    });

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPwdController = async (req, res) => {
  const { token, password } = req.body;

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const { email } = decoded;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  await Session.deleteMany({ userId: user._id });

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
