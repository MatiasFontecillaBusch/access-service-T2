import { connect } from 'amqplib';

const QUEUES = ['user-service-queue'];

let channel;

async function connectToRabbitMQ() {
  const connection = await connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  await Promise.all(
    QUEUES.map((queue) => channel.assertQueue(queue, { durable: true })),
  );
  return channel;
}

export default async function getChannel() {
  if (!channel) {
    channel = await connectToRabbitMQ();
  }
  return channel;
}
