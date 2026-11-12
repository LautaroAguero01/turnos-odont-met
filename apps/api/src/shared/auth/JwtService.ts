import crypto from 'crypto';

export interface JwtPayload {
  sub: string;       // userId
  tenantId: string;
  role: string;
  exp: number;       // epoch seconds
  iat: number;
}

function base64Url(buf: Buffer): string {
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export class JwtService {
  constructor(private secret: string) {}

  sign(payload: Omit<JwtPayload, 'iat' | 'exp'>, ttlSeconds: number): string {
    const now = Math.floor(Date.now() / 1000);
    const full: JwtPayload = { ...payload, iat: now, exp: now + ttlSeconds };
    const header = base64Url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
    const body = base64Url(Buffer.from(JSON.stringify(full)));
    const sig = base64Url(crypto.createHmac('sha256', this.secret).update(`${header}.${body}`).digest());
    return `${header}.${body}.${sig}`;
  }

  verify(token: string): JwtPayload {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Malformed token');
    const [header, body, sig] = parts;
    const expected = base64Url(crypto.createHmac('sha256', this.secret).update(`${header}.${body}`).digest());
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) throw new Error('Invalid signature');
    const payload = JSON.parse(Buffer.from(body, 'base64').toString()) as JwtPayload;
    if (payload.exp <= Math.floor(Date.now() / 1000)) throw new Error('Token expired');
    return payload;
  }
}
