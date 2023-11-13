import { Request, Response } from "express"

import { sesClient } from "../utils/mailClient"
import { SendEmailCommand } from "@aws-sdk/client-ses"

async function sendEmailFromRequestBodyController(req: Request, res: Response) {
  const toAddress = req.body.toAddress
  const subject = req.body.subject
  const bodyText = req.body.bodyText
  // const bodyHtml = req.body.bodyHtml

  const input = {
    // SendEmailRequest
    Source: "noreply@excelmec.org", // required
    Destination: {
      // Destination
      ToAddresses: [
        // AddressList
        toAddress,
      ],
      // CcAddresses: ["STRING_VALUE"],
      // BccAddresses: ["STRING_VALUE"],
    },
    Message: {
      // Message
      Subject: {
        // Content
        Data: subject, // required
        Charset: "utf-8",
      },
      Body: {
        // Body
        Text: {
          Data: bodyText, // required
          Charset: "utf-8",
        },
        // Html: {
        //   Data: "<p>Html Content</p>", // required
        //   Charset: "utf-8",
        // },
      },
    },
    //   ReplyToAddresses: [],
    //   ReturnPath: "",
    //   SourceArn: "",
    //   ReturnPathArn: "",
    // Tags: [
    //   // MessageTagList
    //   {
    //     // MessageTag
    //     Name: "STRING_VALUE", // required
    //     Value: "STRING_VALUE", // required
    //   },
    // ],
    // !----!
    // TODO: Handle this somewhere else
    ConfigurationSetName: "test",
    // !----!
  }

  const command = new SendEmailCommand(input)
  const response = await sesClient.send(command)
  // { // SendEmailResponse
  //   MessageId: "STRING_VALUE", // required
  // };

  res.send(response)
}

export { sendEmailFromRequestBodyController }
