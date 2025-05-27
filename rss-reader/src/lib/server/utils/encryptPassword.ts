import { hash, verify } from '@node-rs/argon2';

export async function encryptPassword(password: string): Promise<string> {
  return await hash(password);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return await verify(hashed, password);
} 