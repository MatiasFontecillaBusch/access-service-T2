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
import { connect } from 'mongoose';

console.log(process.env.NODE_ENV);

import app from './app.js';

export default app;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
).replace('<USER>', process.env.DATABASE_USER);

connect(DB).then(() => console.log('✓ Conexión a base de datos exitosa'));

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
