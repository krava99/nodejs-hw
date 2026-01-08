import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    next(createHttpError(400, 'Email in use'));
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashedPassword });
  const newSession = await createSession(newUser._id);
  setSessionCookies(newSession, res);

  res.status(201).json(newUser);
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    next(createHttpError(401, 'Invalid credentials'));
    return;
  }

  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) {
    next(createHttpError(401, 'Invalid credentials'));
    return;
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setSessionCookies(newSession, res);

  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).end();
};

export const refreshUserSession = async (req, res, next) => {
  const { sessionId, refreshToken } = req.cookies;
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const userId = session.userId;

  const isRefreshTokenExpired = new Date() > session.refreshTokenValidUntil;

  if (isRefreshTokenExpired) {
    next(createHttpError(401, 'Session token expired'));
    return;
  }

  await Session.deleteOne({ _id: sessionId, refreshToken });

  const newSession = await createSession(userId);

  setSessionCookies(newSession, res);

  res.status(200).json({ message: 'Session refreshed' });
};
