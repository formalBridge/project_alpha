import { initQueue } from 'app/lib/queue.server';

export async function publishFeedCreate({ memoId, authorId }: { memoId: number; authorId: number }) {
  try {
    const ch = await initQueue('feed.create');
    const message = { memoId, authorId };

    ch.sendToQueue('feed.create', Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log(`[Queue] Published feed create for post ${memoId}`);
    return message;
  } catch (error) {
    console.error('[Queue] Failed to publish feed create:', error);
    throw error;
  }
}
