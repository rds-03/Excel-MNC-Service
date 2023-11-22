import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import logger from './utils/logger';
import { pingRouter } from './routes/ping';
import { templateRouter } from './routes/template';
import { emailRouter } from './routes/email';
import { ENV, initEnv } from './utils/env';
import { initSesClient } from './utils/mailClient';

import { certificateRouter} from './routes/certificate';
/**
 * Envs must be used after calling initEnv()
 */
initEnv();
initSesClient();

const app: Express = express();

app.disable('etag');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
	morgan(
		function (tokens, req, res) {
			// TODO: Add authorization log back
			// let authorizationLog = '';
			// try {
			//   authorizationLog = req.headers['authorization']
			//     ? Buffer.from(
			//         req.headers['authorization'].split(' ')[1],
			//         'base64'
			//       ).toString('utf8')
			//     : 'Auth-header-missing';
			// } catch (err) {}

			return [
				tokens.method(req, res),
				tokens.url(req, res),
				tokens.status(req, res),
				// authorizationLog,
				tokens['response-time'](req, res),
				'ms',
			].join(' ');
		},
		{ stream: { write: (message) => logger.info(message.trim()) } }
	)
);

app.use('/ping', pingRouter);
app.use('/template', templateRouter);
app.use('/email', emailRouter);
app.use('/certificate',certificateRouter)


app.listen(ENV.PORT, async () => {
	console.log(`[server]: Server is running at http://localhost:${ENV.PORT}`);
});
