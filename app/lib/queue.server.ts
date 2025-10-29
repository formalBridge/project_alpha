import amqp from 'amqplib';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let connection: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let channel: any = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function initQueue(queueName: string): Promise<any> {
  if (connection && channel) {
    return channel;
  }

  try {
    console.log('[Queue] Connecting to RabbitMQ...', RABBITMQ_URL);
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    console.log('[Queue] Connected to RabbitMQ successfully');
    return channel;
  } catch (error) {
    console.error('[Queue] Failed to connect:', error);
    throw error;
  }
}

export async function closeQueue() {
  try {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
    channel = null;
    connection = null;
    console.log('[Queue] Connection closed');
  } catch (error) {
    console.error('[Queue] Error closing connection:', error);
  }
}
