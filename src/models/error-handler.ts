export class ErrorHandler extends Error {
    constructor(
        public message: string = 'Resource not found',
        public detail: Array<{ path: string, kind: string }> = [],
        public code: number = 404
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ValidationError extends ErrorHandler {
    constructor(detail: Array<{ path: string, kind: string }>) {
        super('Validation failed', detail);
    }
}

export class GatewayError extends ErrorHandler {
    constructor(reason: string) {
        super(reason);
    }
}
