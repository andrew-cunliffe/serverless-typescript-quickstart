const ejs = require('ejs');
const path = require('path');

import { SES } from 'aws-sdk';

export class MailService {

    constructor(
        private subject: string,
        private origin: string,
        private destination: Array<string>,
        private replyTo: Array<string> = []
    ) { }

    send(template: string, content: any): Promise<SES.Types.SendEmailResponse> {
        const ses = new SES({ region: 'eu-west-1' });

        const promise = new Promise((resolve, reject) =>
            ejs.renderFile(
                path.join(__dirname, 'templates', `${template}.ejs`),
                content,
                ((error: Error, message: string) => {
                    if (error) {
                        return reject(error);
                    }

                    const request: SES.Types.SendEmailRequest = {
                        Source: this.origin,
                        Destination: {
                            ToAddresses: this.destination
                        },
                        Message: {
                            Subject: {
                                Data: this.subject
                            },
                            Body: {
                                Html: {
                                    Data: message
                                }
                            }
                        }
                    };

                    return resolve(request);
                })
            )
        );

        return promise.then((request: SES.Types.SendEmailRequest) => ses.sendEmail(request).promise());
    }

}
