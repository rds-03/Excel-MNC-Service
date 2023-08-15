import dotenv from 'dotenv';
import logger from './logger';
dotenv.config({ path: '../.env' });

type IEnv = {
  PORT: number;
};

/**
 * Values will be initialized from .env on server start
 * by calling initEnv()
 */
export const ENV: IEnv = {
  PORT: 5000,
};

export function initEnv() {
  if (process.env.PORT) {
    ENV.PORT = parseInt(process.env.PORT);
  } else {
    logger.info('No PORT specified in .env, using default 5000');
  }
}
