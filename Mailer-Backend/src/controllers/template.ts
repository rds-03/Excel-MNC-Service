import { Request, Response } from 'express';
import {
	createTemplateReqBody,
	createTemplateResErrorJson,
	createTemplateResJson,
} from '../types/template';
import {
	CreateTemplateCommand,
	CreateTemplateCommandInput,
	CreateTemplateCommandOutput,
	AlreadyExistsException,
	InvalidTemplateException,
	LimitExceededException,
} from '@aws-sdk/client-ses';
import { sesClient } from '../utils/mailClient';
import logger from '../utils/logger';
import { isAwsError } from '../utils/commonAwsErrors';

async function createTemplateController(
	req: Request<{}, {}, createTemplateReqBody>,
	res: Response
) {
	const params: CreateTemplateCommandInput = {
		Template: {
			TemplateName: req.body.TemplateName,
			SubjectPart: req.body.SubjectPart,
			HtmlPart: req.body.HtmlPart,
			TextPart: req.body.TextPart,
		},
	};

	try {
		const data: CreateTemplateCommandOutput = await sesClient.send(
			new CreateTemplateCommand(params)
		);

		const response: createTemplateResJson = {
			message: 'Template created successfully',
			Template: {
				TemplateName: req.body.TemplateName,
			},
		};
		return res.status(201).json(response);
	} catch (err) {
		let response: createTemplateResErrorJson = {
			message: 'Internal Server Error',
		};

		if (err instanceof AlreadyExistsException) {
			response = {
				message: 'Template already exists',
			};
			return res.status(400).json(response);
		} else if (err instanceof InvalidTemplateException) {
			response = {
				message: 'Invalid template',
			};
			return res.status(400).json(response);
		} else if (err instanceof LimitExceededException) {
			response = {
				message: 'Limit exceeded',
			};
			return res.status(429).json(response);
		} else {
			const awsError = isAwsError(err);
			if (awsError.isAwsError) {
				response = {
					message: awsError.message,
				};
				return res.status(400).json(response);
			}

			logger.error(err);
			return res.status(500).json(response);
		}
	}
}

export { createTemplateController };
