import { serialize } from "cookie";
import * as usersService from '../services/usersService';
import * as sessionsRepository from '../repositories/sessionsRepository';

import type { Users } from '../db/schema';
import type { Session } from '../repositories/sessionsRepository';


const SESSION_COOKIE_NAME = 'session_token';
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 30 * 6 // 6 months
};

export async function login(email: string, password: string, ipAddress: string, deviceInfo: string, userAgent: string): Promise<{ user: Users; setCookie: string; sessionToken: string }> {
  const user = await usersService.validateUserCredentials(email, password);
  const userIdHex = Buffer.isBuffer(user.id) ? user.id.toString('hex') : user.id;
  const sessionData: Session = {
    userId: userIdHex,
    ipAddress,
    deviceInfo,
    userAgent,
    expiresAt: new Date(Date.now() + SESSION_COOKIE_OPTIONS.maxAge * 1000)
  };
  const sessionToken = await sessionsRepository.createSession(sessionData);
  const setCookie = serialize(SESSION_COOKIE_NAME, sessionToken, SESSION_COOKIE_OPTIONS);
  return { user: { ...user, id: userIdHex }, setCookie, sessionToken };
}

export async function logout(sessionToken: string): Promise<void> {
  await sessionsRepository.deleteSession(sessionToken);
}

export async function validateSession(sessionToken: string): Promise<Users | null> {
  const session = await sessionsRepository.getSessionById(sessionToken);
  if (!session || (session.expiresAt && new Date(session.expiresAt) < new Date()) || session.revokedAt) {
    return null;
  }
  return await usersService.getUserById(session.userId);
}

export function getSessionCookie(token: string): string {
  return serialize(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
}

export function clearSessionCookie(): string {
  return serialize(SESSION_COOKIE_NAME, '', { ...SESSION_COOKIE_OPTIONS, maxAge: 0 });
} 