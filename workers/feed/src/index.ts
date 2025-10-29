import { PrismaClient } from '@prisma/client';
import amqp from 'amqplib';
import { config } from 'dotenv';

config();

const prisma = new PrismaClient();
const QUEUE_NAME = 'feed.create';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672';

interface FeedCreateMessage {
  memoId: number;
  authorId: number;
}

async function createFeedsForFollowers(message: FeedCreateMessage) {
  const { memoId, authorId } = message;

  console.log(`[Worker] Creating feeds for memo ${memoId} by user ${authorId}`);

  try {
    // 팔로워 목록 조회
    const followers = await prisma.follow.findMany({
      where: { followingId: authorId },
      select: { followerId: true },
    });

    if (followers.length === 0) {
      console.log(`[Worker] No followers for user ${authorId}`);
      return;
    }

    console.log(`[Worker] Found ${followers.length} followers`);

    // 배치로 Feed 레코드 생성 (한 번에 최대 1000개씩)
    const BATCH_SIZE = 1000;
    let totalCreated = 0;

    for (let i = 0; i < followers.length; i += BATCH_SIZE) {
      const batch = followers.slice(i, i + BATCH_SIZE);

      const result = await prisma.feedData.createMany({
        data: batch.map((f) => ({
          userId: f.followerId,
          memoId: memoId,
        })),
        skipDuplicates: true,
      });

      totalCreated += result.count;
      console.log(`[Worker] Created ${result.count} feeds (batch ${i / BATCH_SIZE + 1})`);
    }

    console.log(`[Worker] Total created ${totalCreated} feed records for memo ${memoId}`);
  } catch (error) {
    console.error('[Worker] Error creating feeds:', error);
    throw error;
  }
}

async function startWorker() {
  try {
    console.log('[Worker] Starting Feed Worker...');
    console.log('[Worker] RabbitMQ URL:', RABBITMQ_URL);
    console.log('[Worker] Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));

    // RabbitMQ 연결
    console.log('[Worker] Connecting to RabbitMQ...');
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Queue 생성 (durable: true로 메시지 영속성 보장)
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // Prefetch: 한 번에 1개씩만 처리 (과부하 방지)
    channel.prefetch(1);

    console.log(`[Worker] ✓ Connected to RabbitMQ`);
    console.log(`[Worker] ✓ Waiting for messages in queue: ${QUEUE_NAME}`);
    console.log('[Worker] ✓ Worker is ready!\n');

    // 메시지 소비
    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (!msg) return;

        const startTime = Date.now();

        try {
          const message: FeedCreateMessage = JSON.parse(msg.content.toString());
          console.log(`\n[Worker] 📨 Received message:`, message);

          await createFeedsForFollowers(message);

          const duration = Date.now() - startTime;
          console.log(`[Worker] ✓ Message processed successfully (${duration}ms)\n`);

          // 성공 시 ACK
          channel.ack(msg);
        } catch (error) {
          const duration = Date.now() - startTime;
          console.error(`[Worker] ✗ Failed to process message (${duration}ms):`, error);

          // 실패 시 NACK (재시도)
          channel.nack(msg, false, true);
        }
      },
      { noAck: false }
    );

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n[Worker] Received ${signal}, shutting down gracefully...`);

      try {
        await channel.close();
        console.log('[Worker] ✓ Channel closed');

        await connection.close();
        console.log('[Worker] ✓ Connection closed');

        await prisma.$disconnect();
        console.log('[Worker] ✓ Database disconnected');

        console.log('[Worker] ✓ Shutdown complete');
        process.exit(0);
      } catch (error) {
        console.error('[Worker] Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('[Worker] Fatal error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Worker 시작
startWorker().catch((error) => {
  console.error('[Worker] Unhandled error:', error);
  process.exit(1);
});
