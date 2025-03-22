//src\services\auth.js

import { UsersCollection } from '../db/models/user.js';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { Session } from '../db/models/session.js';

export const registerUser = async (payload) => {
  const existingUser = await UsersCollection.findOne({ email: payload.email });
  if (existingUser) {
    throw createHttpError(409, 'User already exists');
  }

  // Хешування пароля перед створенням користувача
  payload.password = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create(payload);
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  // Видаляємо всі попередні сесії користувача
  await Session.deleteMany({ userId: user._id });

  // Генеруємо токени
  const accessToken = randomBytes(30).toString('hex');
  const refreshToken = randomBytes(30).toString('hex');

  // Створюємо нову сесію
  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  return session;
};

// Очищення прострочених сесій
export const cleanExpiredSessions = async () => {
  const now = new Date();

  // Видаляємо всі прострочені refreshToken
  const deletedSessions = await Session.deleteMany({
    refreshTokenValidUntil: { $lt: now },
  });

  console.log(`Deleted ${deletedSessions.deletedCount} expired sessions.`);
};
