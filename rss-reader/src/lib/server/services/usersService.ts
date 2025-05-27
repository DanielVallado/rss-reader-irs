import { randomUUID } from 'crypto';
import { encryptPassword, verifyPassword } from '../utils/encryptPassword';
import * as usersRepository from '../repositories/usersRepository';
import * as keysRepository from '../repositories/keysRepository';

import type { User } from '../repositories/usersRepository';
import type { Users } from '../db/schema';

export async function registerUser({ username, email, password, imageUrl }: { username: string; email: string; password: string; imageUrl?: string }): Promise<string> {
  const existing = await usersRepository.getUserByEmail(email);
  if (existing) throw new Error('Email is already in use');
  const hashedPassword = await encryptPassword(password);
  const userId = randomUUID().replace(/-/g, "");
  await usersRepository.createUser({ username, email, imageUrl, id: userId });
  await keysRepository.createKey({
    userId,
    provider: 'local',
    providerId: email,
    password: hashedPassword
  });
  return userId;
}

export async function registerOrLoginWithGoogle({ email, username, googleId, imageUrl }: { email: string; username: string; googleId: string; imageUrl?: string }): Promise<string> {
  let user = await usersRepository.getUserByEmail(email);
  let userId: string;
  if (!user) {
    userId = randomUUID().replace(/-/g, "");
    await usersRepository.createUser({ username, email, imageUrl });
    await keysRepository.createKey({
      userId,
      provider: 'google',
      providerId: googleId
    });
  } else {
    userId = user.id;
    // Ensure Google key exists
    const keys = await keysRepository.getKeysByUserId(userId);
    const hasGoogleKey = keys.some(k => k.provider === 'google' && k.providerId === googleId);
    if (!hasGoogleKey) {
      await keysRepository.createKey({
        userId,
        provider: 'google',
        providerId: googleId
      });
    }
  }
  return userId;
}

export async function validateUserCredentials(email: string, password: string): Promise<Users> {
  const user = await usersRepository.getUserByEmail(email);
  if (!user) throw new Error('Invalid email or password');
  const keys = await keysRepository.getKeysByUserId(user.id);
  const localKey = keys.find(k => k.provider === 'local');
  if (!localKey || !localKey.password) throw new Error('Invalid email or password');
  const valid = await verifyPassword(password, localKey.password);
  if (!valid) throw new Error('Invalid email or password');
  return user;
}

export async function updateUser(id: string, updateData: Partial<User>): Promise<number> {
  if (updateData.email) {
    const existing = await usersRepository.getUserByEmail(updateData.email);
    if (existing && existing.id !== id) throw new Error('Email is already in use');
  }
  return await usersRepository.updateUser(id, updateData);
}

export async function deleteUser(id: string): Promise<number> {
  const keys = await keysRepository.getKeysByUserId(id);
  for (const key of keys) {
    await keysRepository.deleteKey(key.id);
  }
  return await usersRepository.deleteUser(id);
}

export async function changePassword(id: string, oldPassword: string, newPassword: string): Promise<void> {
  const keys = await keysRepository.getKeysByUserId(id);
  const localKey = keys.find(k => k.provider === 'local');
  if (!localKey || !localKey.password) throw new Error('No local password set');
  const valid = await verifyPassword(oldPassword, localKey.password);
  if (!valid) throw new Error('Old password is incorrect');
  const hashed = await encryptPassword(newPassword);
  await keysRepository.updateKey(localKey.id, { password: hashed });
}

export async function getUserById(id: string): Promise<Users | null> {
  return await usersRepository.getUserById(id);
}

export async function getUserByEmail(email: string): Promise<Users | null> {
  return await usersRepository.getUserByEmail(email);
}

export async function getAllUsers(): Promise<Users[]> {
  return await usersRepository.getAllUsers();
} 