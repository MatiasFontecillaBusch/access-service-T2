import { userCreationConsumer } from './consumers/usersConsumer.js';

async function initializeQueueConsumers() {
  await userCreationConsumer();
}

export default initializeQueueConsumers;
