// app/routes/media.tsx

import { data } from '@remix-run/router';
import { Client } from 'minio';

const endPoint = process.env.MINIO_ENDPOINT || 'localhost';
const port = Number(process.env.MINIO_PORT) || 9000;
const useSSL = (process.env.MINIO_USE_SSL ?? 'true') !== 'false';
const accessKey = process.env.MINIO_ACCESS_KEY || '';
const secretKey = process.env.MINIO_SECRET_KEY || '';

export async function loader() {
  try {
    // MinIO 연결 상태 테스트
    const client = new Client({ endPoint, port, useSSL, accessKey, secretKey });

    console.log('minio info', endPoint, port, useSSL, accessKey, secretKey);
    console.log('MinIO Client:', client);

    const buckets = await client.listBuckets();

    return data({ status: 'ok', buckets });
  } catch (err) {
    console.error('Error connecting to MinIO:', err);
    return data({ status: 'error', message: (err as Error).stack }, { status: 500 });
  }
}
