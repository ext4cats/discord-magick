import nacl from 'tweetnacl';
import { Buffer } from 'node:buffer';

export async function verifyDiscordRequest(
  request: Request,
  publicKey: string,
): Promise<boolean> {
  const signature = request.headers.get('X-Signature-Ed25519') || '';
  const timestamp = request.headers.get('X-Signature-Timestamp') || '';
  const body = await request.clone().text();

  try {
    return nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, 'hex'),
      Buffer.from(publicKey, 'hex'),
    );
  } catch (error) {
    console.error(error);
    return false;
  }
}
