import type { User } from './data/users.js';
import type { ServerResponse } from 'node:http';

enum ResCode {
    success = 200,
    created = 201,
    deleted = 204,
    invalidData = 400,
    notFound = 404,
    internalError = 500,
}

enum ResMessage {
    invalidId = 'Not valid id (not uuid)',
    invalidBody = 'Request body does not contain required fields ro containg wrong data type',
    resourceNotFound = 'Resource does not exist',
    userNotFound = "User with provided id doesn't exist",
    internalErorr = 'Internal Server Error',
}

const sendResponse = (
    res: ServerResponse,
    code: ResCode,
    data?: ResMessage | User | User[],
): void => {
    if (data) {
        res.writeHead(code, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } else {
        res.writeHead(code);
        res.end();
    }
};

export default sendResponse;
export { ResCode, ResMessage };
