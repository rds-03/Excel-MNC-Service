import { SESClient } from '@aws-sdk/client-ses';
import { ENV } from './env';

const sesClient = new SESClient({
	region: ENV.AWS_REGION,
});

export { sesClient };
