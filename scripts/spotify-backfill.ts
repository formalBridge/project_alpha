import fs from 'fs';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
const require = createRequire(import.meta.url);

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

{
  const raw = process.env.DATABASE_URL;
  const sanitized = raw?.replace(/^['"]|['"]$/g, '');
  if (sanitized && sanitized !== raw) {
    process.env.DATABASE_URL = sanitized;
  }
}

const runningInDocker = (() => {
  try {
    if (fs.existsSync('/.dockerenv')) return true;
    const cgroup = fs.readFileSync('/proc/1/cgroup', 'utf8');
    return /docker|containerd|kubepods/.test(cgroup);
  } catch {
    return false;
  }
})();

(() => {
  const raw = process.env.DATABASE_URL;
  if (!raw) return;
  const s = raw.replace(/^['"]|['"]$/g, '');
  try {
    const u = new URL(s);
    const isPg = u.protocol === 'postgresql:' || u.protocol === 'postgres:';
    const isLocalHost = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
    if (runningInDocker && isPg && isLocalHost) {
      u.hostname = 'host.docker.internal';
      process.env.DATABASE_URL = u.toString();
      console.log('[BACKFILL] DATABASE_URL host rewritten to host.docker.internal (running in Docker)');
    }
  } catch {}
})();

const prisma = new PrismaClient();

const maskDatabaseUrl = (url?: string) => {
  if (!url) return '(empty)';
  try {
    const s = url.replace(/^['"]|['"]$/g, '');
    const u = new URL(s);
    const user = u.username ? '***' : '';
    const pass = u.password ? '***' : '';
    const auth = user || pass ? `${user}:${pass}@` : '';
    return `${u.protocol}//${auth}${u.hostname}:${u.port}${u.pathname}${u.search}`;
  } catch {
    return '(unparsable)';
  }
};

const DRY_RUN = process.env.DRY_RUN === 'true';
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE ?? '100', 10);

const backfillSpotifyIds = async () => {
  try {
    const { SpotifyAPI } = await import(new URL('../app/external/music/SpotifyAPI.js', import.meta.url).href);
    const spotifyAPI = new SpotifyAPI();
    console.log('[BACKFILL] DATABASE_URL:', maskDatabaseUrl(process.env.DATABASE_URL));
    const dbInfo = await prisma.$queryRaw<
      { db: string; schema: string }[]
    >`select current_database() as db, current_schema() as schema`;
    console.log('[BACKFILL] DB info:', dbInfo?.[0]);

    const targetCount = await prisma.song.count({ where: { spotifyId: null } });
    console.log('[BACKFILL] spotifyId IS NULL count:', targetCount);

    const songsWithoutSpotifyId = await prisma.song.findMany({
      where: {
        spotifyId: null,
      },
      select: {
        id: true,
        title: true,
        artist: true,
      },
      take: BATCH_SIZE,
    });

    console.log(
      `[BACKFILL] targets fetched: ${songsWithoutSpotifyId.length} (batchSize=${BATCH_SIZE}) DRY_RUN=${DRY_RUN}`
    );

    const total = songsWithoutSpotifyId.length;

    if (total === 0) {
      console.log('[BACKFILL] No targets in this database/schema. Check DATABASE_URL or seed test data.');
      return;
    }

    for (let i = 0; i < total; i++) {
      const song = songsWithoutSpotifyId[i];
      console.log(`[${i + 1}/${total}] Processing: "${song.title}" by "${song.artist}"`);

      try {
        const results = await spotifyAPI.search({
          title: song.title,
          artist: song.artist,
        });

        if (results.length > 0 && results[0].spotifyId) {
          const spotifyId = results[0].spotifyId;

          if (DRY_RUN) {
            console.log(`[DRY] would update songId=${song.id} spotifyId=${spotifyId}`);
          } else {
            await prisma.song.update({
              where: { id: song.id },
              data: { spotifyId },
            });
          }
        }
      } catch (error) {
        console.error(`Error searching for "${song.title}":`, error);
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  } catch (error) {
    console.error('Error during backfill process:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

export default backfillSpotifyIds;

const isMain = (() => {
  try {
    return !!process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
  } catch {
    return false;
  }
})();

if (isMain) {
  backfillSpotifyIds()
    .then(() => {
      console.log('[BACKFILL] done');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[BACKFILL] failed', err);
      process.exit(1);
    });
}
