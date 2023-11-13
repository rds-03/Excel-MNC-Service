import { Request, Response } from "express"
import {
  createTemplateReqBody,
  createTemplateResErrorJson,
  createTemplateResJson,
} from "../types/template"
import {
  CreateTemplateCommand,
  CreateTemplateCommandInput,
  CreateTemplateCommandOutput,
  AlreadyExistsException,
  InvalidTemplateException,
  LimitExceededException,
  ListTemplatesCommand,
  SendTemplatedEmailCommand,
  GetTemplateCommand,
} from "@aws-sdk/client-ses"
import { sesClient } from "../utils/mailClient"
import logger from "../utils/logger"
import { isAwsError } from "../utils/commonAwsErrors"

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

async function getAllEmailTemplatesController(req: Request, res: Response) {
  try {
    const input = {
      MaxItems: Number(req.query.MaxItems) || 10,
    }

    const command = new ListTemplatesCommand(input)
    const response = await sesClient.send(command)

    res.send(response)
  } catch (err) {
    res.status(500).send(err)
  }
}
async function getEmailTemplateController(req: Request, res: Response) {
  try {
    const { templateName } = req.params
    const input = {
      TemplateName: templateName,
    }
    const command = new GetTemplateCommand(input)
    const response = await sesClient.send(command)

    res.send(response.Template)
  } catch (err) {
    res.status(500).send(err)
  }
}

async function sendEmailFromTemplateNameController(
  req: Request,
  res: Response
) {
  try {
    const { templateName } = req.params
    const { recipients } = req.body

    const input = {
      // SendTemplatedEmailRequest
      Source: "noreply@excelmec.org", // required
      Destination: {
        // Destination
        ToAddresses: recipients,
        //   CcAddresses: [
        // 	"STRING_VALUE",
        //   ],
        //   BccAddresses: [
        // 	"STRING_VALUE",
        //   ],
      },
      ReplyToAddresses: ["noreply@excelmec.org"],
      //   ReturnPath: "STRING_VALUE",
      //   SourceArn: "STRING_VALUE",
      //   ReturnPathArn: "STRING_VALUE",
      //   Tags: [
      //     // MessageTagList
      //     {
      //       // MessageTag
      //       Name: "STRING_VALUE", // required
      //       Value: "STRING_VALUE", // required
      //     },
      //   ],
      // !----!
      // TODO: Handle this somewhere else
      ConfigurationSetName: "test",
      // !----!
      Template: templateName, // required
      //   TemplateArn: "STRING_VALUE",
      TemplateData: `{
		                    "message": "Hello World!",
                        "SubjectPart": "Subject Part",
                        "TextPart": "Text Part",
                        "HtmlPart": "HTML Part"
                      }`,
    }
    const command = new SendTemplatedEmailCommand(input)
    const response = await sesClient.send(command)
   
    res.send(response)
  } catch (err) {
    res.status(500).send(err)
  }
}

export {
  createTemplateController,
  getAllEmailTemplatesController,
  getEmailTemplateController,
  sendEmailFromTemplateNameController,
}
