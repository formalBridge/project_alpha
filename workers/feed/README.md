# Feed Worker

RabbitMQ worker for processing feed creation events.

## Setup

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# DATABASE_URL, RABBITMQ_URL

# Generate Prisma Client
pnpm prisma:generate
```

## Development

```bash
# Run in development mode (with hot reload)
pnpm dev
```

## Production

```bash
# Build
pnpm build

# Run
pnpm start
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `RABBITMQ_URL`: RabbitMQ connection string (default: `amqp://admin:admin@localhost:5672`)
- `NODE_ENV`: Environment (development/production)

## How it works

1. Listens to `feed.create` queue
2. Receives messages with `{ memoId, authorId }`
3. Finds all followers of the author
4. Creates feed records for each follower in batches
5. Acknowledges the message when done

## Message Format

```json
{
  "memoId": 123,
  "authorId": 456
}
```
