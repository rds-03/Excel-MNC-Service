import dotenv from 'dotenv';
import logger from './logger';
dotenv.config({ path: '../.env' });

type IEnv = {
	PORT: number;
	AWS_REGION: string;
	AWS_ACCESS_KEY_ID: string;
	AWS_SECRET_ACCESS_KEY: string;
};

/**
 * Values will be initialized from .env on server start
 * by calling initEnv()
 * Default values are set here
 */
export const ENV: IEnv = {
	PORT: 5000,
	AWS_REGION: 'ap-south-1',
	AWS_ACCESS_KEY_ID: '',
	AWS_SECRET_ACCESS_KEY: '',
};

export function initEnv() {
	if (process.env.PORT) {
		ENV.PORT = parseInt(process.env.PORT);
	} else {
		logger.info(
			`No PORT specified in .env, using default ${ENV.PORT}`
		);
	}

	if (process.env.AWS_REGION) {
		ENV.AWS_REGION = process.env.AWS_REGION;
	} else {
		logger.info(
			`No AWS_REGION specified in .env, using default: ${ENV.AWS_REGION}`
		);
	}

	let requiredEnvs: string[] = [];

	if (process.env.AWS_ACCESS_KEY_ID) {
		ENV.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
	} else {
		requiredEnvs.push('AWS_ACCESS_KEY_ID');
		logger.error(`Fatal: No AWS_ACCESS_KEY_ID specified in .env`);
	}

	if (process.env.AWS_SECRET_ACCESS_KEY) {
		ENV.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
	} else {
		requiredEnvs.push('AWS_SECRET_ACCESS_KEY');
		logger.error(`Fatal: No AWS_SECRET_ACCESS_KEY specified in .env`);
	}

	if (requiredEnvs.length > 0) {
		logger.error(
			`Fatal: Required environment variables not set: ${requiredEnvs.join(
				', '
			)}`
		);
		process.exit(1);
	}
}
