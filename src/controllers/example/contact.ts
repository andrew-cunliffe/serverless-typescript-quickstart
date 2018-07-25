import * as parser from 'body-parser';

import { Request, Response, NextFunction, Router } from 'express';

import { GatewayError, ValidationError } from '../../models';
import { ErrorService, MailService } from '../../services';

import { config } from '../../config';

export class ContactController {

    public router: Router;

    private errorService: ErrorService;

    constructor() {
        this.router = Router();
        this.errorService = new ErrorService();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.use(parser.json({ type: 'application/json' }));

        this.router.post('/', this.sendMessage.bind(this));
    }

    sendMessage(req: Request, res: Response, next: NextFunction) {
        const requestErrors = this.errorService.requiredFields(req.body, ['fullName', 'email', 'message']);

        if (requestErrors.length) {
            return next(new ValidationError(requestErrors));
        }

        const subject = req.body.subject || 'Web Contact';
        const sender = `${config.contactEmail} <${config.contactEmail}>`;
        const message = req.body;

        const mailer = new MailService(subject, sender, [config.contactEmail]);
        const content = { subject, message, sender };

        return mailer
            .send('contact', content)
            .then(() => res.status(202).send())
            .catch((error) => next(new GatewayError(error.message)));
    }

}

export default new ContactController().router;
