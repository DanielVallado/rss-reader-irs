import { randomUUID } from 'crypto';

export function generateUuidBuffer(): Buffer {
  return Buffer.from(randomUUID().replace(/-/g, ''), 'hex');
}

export function uuidToBuffer(uuid: string | Buffer): Buffer {
  if (Buffer.isBuffer(uuid)) return uuid;
  return Buffer.from(uuid.replace(/-/g, ''), 'hex');
}

export function bufferToUuidString(buffer: Buffer): string {
  return buffer.toString('hex');
} 