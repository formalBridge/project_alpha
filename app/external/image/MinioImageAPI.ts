import { Readable } from 'node:stream';
import { ReadableStream as WebReadableStream } from 'node:stream/web';

import { Client } from 'minio';

import { ImageInfo, UploadParams } from './ImageStorage';

const endPoint = process.env.MINIO_ENDPOINT || 'localhost';
const port = Number(process.env.MINIO_PORT) || 9000;
const useSSL = (process.env.MINIO_USE_SSL ?? 'true') !== 'false';
const accessKey = process.env.MINIO_ACCESS_KEY || '';
const secretKey = process.env.MINIO_SECRET_KEY || '';
const BUCKET = process.env.MINIO_BUCKET || 'avatars';

console.log('MinIO Config:', { endPoint, port, useSSL, accessKey, secretKey, BUCKET });

export class MinioImageAPI {
  private client = new Client({ endPoint, port, useSSL, accessKey, secretKey });

  private async ensureBucket() {
    const ok = await this.client.bucketExists(BUCKET).catch(() => false);
    if (!ok) await this.client.makeBucket(BUCKET, 'us-east-1');
  }

  async upload({ userId, file, kind = 'misc' }: UploadParams): Promise<ImageInfo> {
    await this.ensureBucket();

    const now = Date.now();
    const ext = (file.name?.split('.').pop() || file.type.split('/')[1] || 'bin').toLowerCase().replace('jpeg', 'jpg');

    const dir = kind === 'avatar' ? '' : kind === 'post' ? 'posts' : 'misc';
    const key = dir ? `${dir}/${userId}/${now}.${ext}` : `${userId}/${now}.${ext}`;

    // Web ReadableStream -> Node Readable
    const webStream = file.stream() as unknown as WebReadableStream<Uint8Array>;
    const stream = Readable.fromWeb(webStream);

    const meta = {
      'Content-Type': file.type || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    };

    // putObject(bucket, objectName, stream, size?, metaData?)
    await this.client.putObject(BUCKET, key, stream, file.size, meta);

    return { key, contentType: meta['Content-Type'], size: file.size ?? 0 };
  }

  async signedGetUrl(key: string, expiresSec = 300) {
    return this.client.presignedGetObject(BUCKET, key, expiresSec);
  }

  async remove(key: string) {
    await this.client.removeObject(BUCKET, key);
  }

  getPublicUrl(key: string) {
    const protocol = useSSL ? 'https' : 'http';
    return `${protocol}://${endPoint}:${port}/${BUCKET}/${key}`;
  }
}
