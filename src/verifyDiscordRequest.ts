import nacl from 'tweetnacl';

function hexToUint8(hexString: string): Uint8Array {
  const match = hexString.match(/.{1,2}/g);
  if (!match) {
    throw new Error('Invalid hex string');
  }
  return Uint8Array.from(match.map((byte) => parseInt(byte, 16)));
}

async function verifyDiscordRequest(
  request: Request,
  publicKey: string,
): Promise<boolean> {
  const signature = request.headers.get('X-Signature-Ed25519') || '';
  const timestamp = request.headers.get('X-Signature-Timestamp') || '';
  const body = await request.clone().text();

  const message = new TextEncoder().encode(timestamp + body);
  try {
    return nacl.sign.detached.verify(
      message,
      hexToUint8(signature),
      hexToUint8(publicKey),
    );
  } catch {
    return false;
  }
}

export default verifyDiscordRequest;
