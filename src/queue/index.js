import {
  userPasswordUpdate,
  userProfileUpdate,
} from './consumers/usersConsumer.js';

async function initializeQueueConsumers() {
  await userPasswordUpdate();
  await userProfileUpdate();
}

export default initializeQueueConsumers;
