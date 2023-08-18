/* import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
 */ var AWS = require('aws-sdk');
var dotenv = require("dotenv").config({
    path: "../../../.env"
});
// const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses"); // CommonJS import
/* const config = {
    region: process.env.AWS_REGION, // Replace with your environment variable names
 credentials:{
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }; */
var SES_CONFIG = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
};
var AWS_SES = new AWS.SES(SES_CONFIG);
var sendEmail = function (recipientEmail, name) {
    var params = {
        Source: 'Excel MEC <noreply@excelmec.org>',
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
                Data: "Hello, ".concat(name, "!"),
            }
        },
    };
    return AWS_SES.sendEmail(params).promise();
};
sendEmail("4adhi007@gmail.com", "Adithya")
    .then(function (data) {
    console.log("Email sent:", data);
})
    .catch(function (error) {
    console.error("Error sending email:", error);
});
