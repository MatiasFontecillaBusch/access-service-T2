import { userPasswordUpdate, userCreate } from './consumers/usersConsumer.js';

async function initializeQueueConsumers() {
  await userPasswordUpdate();
  await userCreate();
}

export default initializeQueueConsumers;
