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
// eslint-disable-next-line no-unused-vars
import prisma from '#database/prisma.js';

export default app;

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`- Entorno:      ${environments[process.env.NODE_ENV]}`);
  console.log(`- Puerto:       ${port}`);
  console.log(`- URL:          ${process.env.SERVER_URL}:${port}`);
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
