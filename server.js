/* eslint-disable no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable import/first */
/* eslint-disable no-console */
import dotenv from 'dotenv';

const environments = {
  development: 'Desarrollo',
  production: 'Producción',
};

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Apagando el servidor...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './.env' });

console.log(process.env.NODE_ENV);

import app from './app.js';
import prisma from '#database/prisma.js';
import initializeQueueConsumers from '#queue/index.js';

initializeQueueConsumers().then(() =>
  console.log('Conexión con RabbitMQ exitosa.'),
);

export default app;

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`- Entorno:      ${environments[process.env.NODE_ENV]}`);
  console.log(`- Puerto:       ${port}`);
  console.log(`- URL:          ${process.env.SERVER_URL}:${port}`);
  console.log('Conexión con MS SQL Server exitosa.');
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Apagando el servidor...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Apagando el servidor.');
  server.close(() => {
    console.log('Servidor apagado!');
  });
});
