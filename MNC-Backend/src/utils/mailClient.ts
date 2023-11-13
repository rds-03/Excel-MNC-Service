import { SESClient } from '@aws-sdk/client-ses';
import { ENV } from './env';

let sesClient: SESClient = undefined!;

function initSesClient() {
	if (
		!ENV.AWS_REGION ||
		!ENV.AWS_ACCESS_KEY_ID ||
		!ENV.AWS_SECRET_ACCESS_KEY
	) {
		throw new Error('AWS Credentials not found');
	}

	sesClient = new SESClient({
		region: ENV.AWS_REGION,
		credentials: {
			accessKeyId: ENV.AWS_ACCESS_KEY_ID,
			secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
		},
	});
}

export { sesClient, initSesClient };
