import { randomUUID } from 'node:crypto';

import { Client } from 'minio';

import { prisma } from 'app/utils/getPrisma';

import { ImageInfo, UploadParams } from './ImageStorage';

const endPoint = process.env.MINIO_ENDPOINT || 'localhost';
const publicHost = process.env.MINIO_PUBLIC_ENDPOINT || endPoint;
const port = Number(process.env.MINIO_PORT) || 9000;
const useSSL = (process.env.MINIO_USE_SSL ?? 'true') !== 'false';
const accessKey = process.env.MINIO_ACCESS_KEY || '';
const secretKey = process.env.MINIO_SECRET_KEY || '';
const BUCKET = process.env.MINIO_BUCKET || 'avatars';

export class MinioImageAPI {
  private client = new Client({ endPoint, port, useSSL, accessKey, secretKey });

  private async ensureBucket() {
    const ok = await this.client.bucketExists(BUCKET).catch(() => false);
    if (!ok) await this.client.makeBucket(BUCKET, 'us-east-1');
  }

  async upload({ userId, file, kind = 'misc' }: UploadParams): Promise<ImageInfo> {
    await this.ensureBucket();

    const ext = file.name.split('.').pop()?.toLowerCase().replace('jpeg', 'jpg') || 'png';

    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });

    if (existing?.avatarUrl) {
      const parts = existing.avatarUrl.split('/');
      const oldKey = parts.slice(-2).join('/');
      await this.client.removeObject(BUCKET, oldKey);
    }

    const key = `${kind}/${randomUUID()}.${ext}`;

    const mimeType =
      ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'png' ? 'image/png' : 'application/octet-stream';

    const meta = {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    };

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await this.client.putObject(BUCKET, key, buffer, buffer.length, meta);

    return { key, contentType: meta['Content-Type'], size: 0 };
  }

  async signedGetUrl(key: string, expiresSec = 300) {
    return this.client.presignedGetObject(BUCKET, key, expiresSec);
  }

  async remove(key: string) {
    await this.client.removeObject(BUCKET, key);
  }

  getPublicUrl(key: string) {
    const protocol = useSSL ? 'https' : 'http';
    const safeKey = key
      .split('/')
      .map((part) => encodeURIComponent(part))
      .join('/');

    const defaultPort = useSSL ? 443 : 80;
    const portPart = port === defaultPort ? '' : `:${port}`;

    return `${protocol}://${publicHost}${portPart}/${BUCKET}/${safeKey}`;
  }
}
