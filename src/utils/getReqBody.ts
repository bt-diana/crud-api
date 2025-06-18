import type { IncomingMessage } from 'node:http';

class ParsingError extends Error {
    constructor(cause: unknown) {
        super('An error occured during parsing requst body', { cause });
    }
}

class NoBodyError extends Error {
    constructor() {
        super("Request doesn't have a body");
    }
}

const getReqBody = (req: IncomingMessage): Promise<unknown> =>
    new Promise((resolve, reject) => {
        const body: Uint8Array[] = [];
        req.on('data', (chunk) => {
            try {
                body.push(chunk);
            } catch (e) {
                reject(new ParsingError(e));
            }
        }).on('end', () => {
            try {
                const data = JSON.parse(Buffer.concat(body).toString());
                if (data) {
                    resolve(data);
                } else {
                    reject(new NoBodyError());
                }
            } catch (e) {
                reject(new ParsingError(e));
            }
        });
    });

export default getReqBody;
