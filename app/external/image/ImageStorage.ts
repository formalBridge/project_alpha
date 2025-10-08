import { MinioImageAPI } from './MinioImageAPI';

export class ImageStorage {
  constructor(private imageAPI: MinioImageAPI) {}

  async upload(params: UploadParams): Promise<ImageInfo> {
    const info = await this.imageAPI.upload(params);

    const publicUrl = this.imageAPI.getPublicUrl(info.key);

    return { ...info, url: publicUrl };
  }
  signedGetUrl(key: string, expiresSec?: number) {
    return this.imageAPI.signedGetUrl(key, expiresSec);
  }
  remove(key: string) {
    return this.imageAPI.remove(key);
  }

  uploadAvatar(userId: number | string, file: File) {
    return this.upload({ userId: Number(userId), file, kind: 'avatar' });
  }
}

export const imageStorage = new ImageStorage(new MinioImageAPI());

export type UploadKind = 'avatar' | 'post' | 'misc';

export interface UploadParams {
  userId: number;
  file: File;
  kind?: 'avatar' | 'post' | 'misc';
}

export interface ImageInfo {
  key: string;
  contentType: string;
  size: number;
  url?: string;
}
