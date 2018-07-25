import { createLogger, format, transports } from 'winston';

import { Request, Response, NextFunction } from 'express';

import { ErrorHandler } from '../models';

export class ErrorService {

    requiredFields(body: any, fields: Array<string>): Array<{ path: string, kind: string}> {
        return fields.filter((key) => !body[key]).map((key) => ({ path: key, kind: 'required' }));
    }

    static handleError(exception: ErrorHandler, req: Request, res: Response, next: NextFunction): void {
        const logger = createLogger({
            level: 'warn',
            format: format.combine(
                format.timestamp(),
                format.ms(),
                format.json()
            ),
            transports: [
                new transports.Console()
            ]
        });

        let message = 'Resource not found';
        const detail = new Set();

        switch(exception.name) {
            case 'ValidationError':
                message = 'Validation failed';
                exception.code = 400;

                exception.detail.forEach((error) => {
                    detail.add(`${error.path} ${error.kind}`.trim());
                });

                logger.debug(`[${exception.name}] ${exception.message} - ${exception.detail.join(', ')}`);
                break;
            case 'GatewayError':
                message = 'Third party error';
                exception.code = 503;
                logger.error(`[${exception.name}] ${exception.message}`);
                break;
            default:
                message = 'Internal server error';
                exception.code = 500;
                logger.warn(`[${exception.name}] ${exception.code} - ${exception.message}`);
        }

        res.status(exception.code).send({ message, detail: [...detail] });
    }

}

export default ErrorService.handleError;
