import getChannel from '#queue/config/connection.js';

export const userCreationConsumer = async () => {
  const channel = await getChannel();
  channel.consume('user-service-queue', (data) => {
    const content = JSON.parse(data.content);
    console.log(content);
    channel.ack(data);
  });
};
