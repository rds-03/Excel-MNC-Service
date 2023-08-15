import express, { Express } from 'express';
import morgan from 'morgan';
import cors from "cors";

import logger from './utils/logger';
import { pingRouter } from './routes/ping';
import { ENV, initEnv } from './utils/env';

const app: Express = express();

app.disable('etag');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan(function (tokens, req, res) {
    let authorizationLog = ""
    try {
        authorizationLog = req.headers["authorization"] ?
            Buffer.from(req.headers["authorization"].split(" ")[1], 'base64').toString('utf8') :
            "Auth-header-missing";
    } catch (err) {

    }

    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        authorizationLog,
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}, { stream: { write: message => logger.info(message.trim()) } }));

app.use('/ping', pingRouter);

/**
 * Envs must be used after calling initEnv()
 */
initEnv();

app.listen(ENV.PORT, async () => {
    console.log(`[server]: Server is running at http://localhost:${ENV.PORT}`);
});