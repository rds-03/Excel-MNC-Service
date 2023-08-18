const AWS=require('aws-sdk')

const dotenv = require("dotenv").config({
  path: "../../../.env"
})

const SES_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};
const AWS_SES=new AWS.SES(SES_CONFIG)
  let sendEmail = (recipientEmail: string, name:string) => {
    let params = {
      Source: process.env.AWS_SES_SENDER,
      Destination: {
        ToAddresses: [
          recipientEmail
        ],
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: 'This is the body of my email!',
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `Hello, ${name}!`,
        }
      },
    };
    return AWS_SES.sendEmail(params).promise();
};
sendEmail("mail@gmail.com", "Name")   //mail id and name as parameters
  .then((data :string) => {
    console.log("Email sent:", data);
  })
  .catch((error:string) => {
    console.error("Error sending email:", error);
  });





