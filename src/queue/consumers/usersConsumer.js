import prisma from '#database/prisma.js';
import getChannel from '#queue/config/connection.js';

export const userPasswordUpdate = async () => {
  const channel = await getChannel();

  channel.consume('user-update-password-queue', async (data) => {
    const { id, hashedNewPassword } = JSON.parse(data.content);

    try {
      await prisma.user.update({
        where: { id: id },
        data: { hashedPassword: hashedNewPassword },
      });
      channel.ack(data);
    } catch (error) {
      console.error('Failed to update password:', error);
      channel.nack(data, false, true);
    }
  });
};

export const userProfileUpdate = async () => {
  const channel = await getChannel();

  channel.consume('user-creation-queue', async (data) => {
    const content = JSON.parse(data.content);
    console.log('Received message for creating user:', content);

    try {
      await prisma.user.create({ data: content });
      channel.ack(data);
    } catch (error) {
      console.error('Failed to create user:', error);
      channel.nack(data, false, true);
    }
  });
};
