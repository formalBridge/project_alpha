import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const require = createRequire(import.meta.url);
require('dotenv').config();

type Runnable = () => unknown | Promise<unknown>;

const isRunnable = (fn: unknown): fn is Runnable => typeof fn === 'function';

const pickRunFn = (mod: unknown): (() => Promise<void>) => {
  const rec = mod as Record<string, unknown>;
  const candidates: unknown[] = [rec.default, rec.run];

  for (const c of candidates) {
    if (isRunnable(c)) {
      return async () => {
        await c();
      };
    }
  }

  throw new Error(`Module must export a default function or a named 'run' function.`);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runJob() {
  const jobName = process.env.JOB_NAME;
  if (!jobName) {
    console.error('❌ JOB_NAME env is not set.');
    console.error('Usage: JOB_NAME=<relative-or-absolute-path> node dist/scripts/job-runner.js');
    process.exit(1);
  }

  let normalizedJobName = jobName.trim();
  if (normalizedJobName.startsWith('./scripts/') || normalizedJobName.startsWith('scripts/')) {
    normalizedJobName = normalizedJobName.replace(/^\.?\/?scripts\//, './');
  }

  const start = Date.now();
  console.log(`🚀 Starting job: ${jobName}`);
  console.log(`📅 Time: ${new Date().toISOString()}`);

  try {
    const absPath = path.isAbsolute(normalizedJobName) ? normalizedJobName : path.resolve(__dirname, normalizedJobName);
    console.log(`📂 Loading: ${absPath}`);

    const modUrl = pathToFileURL(absPath).href;
    const job: unknown = await import(modUrl);

    const runFn = pickRunFn(job);

    await runFn();

    const sec = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`\n✅ Job "${jobName}" completed in ${sec}s.`);
    process.exit(0);
  } catch (err) {
    const sec = ((Date.now() - start) / 1000).toFixed(2);
    console.error(`\n❌ Job "${jobName}" failed after ${sec}s.`);
    console.error(err);
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  console.log('⚠️  Received SIGTERM');
  process.exit(143);
});
process.on('SIGINT', () => {
  console.log('⚠️  Received SIGINT');
  process.exit(130);
});

runJob();
