//src\services\auth.js

import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';

import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({
    name,
    email,
    password: hashedPassword,
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Unauthorized');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Session.deleteMany({ userId: user._id });

  const accessToken = randomBytes(30).toString('hex');
  const refreshToken = randomBytes(30).toString('hex');

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });

  return { accessToken, refreshToken };
};

export const cleanExpiredSessions = async () => {
  const now = new Date();

  const deletedSessions = await Session.deleteMany({
    refreshTokenValidUntil: { $lt: now },
  });

  console.log(`Deleted ${deletedSessions.deletedCount} expired sessions.`);
};

export const refreshSession = async (refreshToken) => {
  const existingSession = await Session.findOne({ refreshToken });
  if (!existingSession || existingSession.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }

  await Session.deleteMany({ userId: existingSession.userId });

  const accessToken = randomBytes(30).toString('hex');
  const newRefreshToken = randomBytes(30).toString('hex');

  await Session.create({
    userId: existingSession.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });

  return { accessToken, newRefreshToken };
};

export const logoutUser = async (refreshToken) => {
  const deletedSession = await Session.findOneAndDelete({ refreshToken });
  if (!deletedSession) {
    throw createHttpError(404, 'Session not found');
  }
};
