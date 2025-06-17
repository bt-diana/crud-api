import uuidIsValid from './utils/uuidIsValid.js';
import type { User } from './data/users.js';
import {
    addUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
} from './data/users.js';
import { RequestListener, IncomingMessage, ServerResponse } from 'node:http';

enum Endpoints {
    users = '/api/users',
}

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
    resourseNotFound = 'Resource does not exist',
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

const requestListener: RequestListener<
    typeof IncomingMessage,
    typeof ServerResponse
> = (req, res) => {
    if (req.url === Endpoints.users) {
        if (req.method === 'GET') {
            sendResponse(res, ResCode.success, getUsers());
            return;
        }

        if (req.method === 'POST') {
            const id = req.url.slice(Endpoints.users.length + 1);

            if (!id || !uuidIsValid(id)) {
                sendResponse(res, ResCode.invalidData, ResMessage.invalidId);
                return;
            }

            const body: Uint8Array[] = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                const userData: Omit<User, 'id'> = JSON.parse(
                    Buffer.concat(body).toString(),
                );

                if (
                    typeof userData.username !== 'string' ||
                    !userData.username ||
                    typeof userData.age !== 'number' ||
                    userData.age < 0 ||
                    !Array.isArray(userData.hobbies) ||
                    userData.hobbies.some((value) => typeof value !== 'string')
                ) {
                    sendResponse(
                        res,
                        ResCode.invalidData,
                        ResMessage.invalidBody,
                    );
                    return;
                }

                const user = addUser({
                    id: id,
                    username: userData.username,
                    age: userData.age,
                    hobbies: userData.hobbies,
                });

                if (user) {
                    sendResponse(res, ResCode.success, user);
                    return;
                }
            });

            return;
        }
    }

    if (req.url?.startsWith(Endpoints.users)) {
        const id = req.url.slice(Endpoints.users.length + 1);

        if (!id || !uuidIsValid(id)) {
            sendResponse(res, ResCode.invalidData, ResMessage.invalidId);
            return;
        }

        if (req.method === 'GET') {
            const user = getUser(id);
            if (user) {
                sendResponse(res, ResCode.success, user);
                return;
            }
        }

        if (req.method === 'PUT') {
            const body: Uint8Array[] = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                const userData: Omit<User, 'id'> = JSON.parse(
                    Buffer.concat(body).toString(),
                );

                if (
                    typeof userData.username !== 'string' ||
                    !userData.username ||
                    typeof userData.age !== 'number' ||
                    userData.age < 0 ||
                    !Array.isArray(userData.hobbies) ||
                    userData.hobbies.some((value) => typeof value !== 'string')
                ) {
                    sendResponse(
                        res,
                        ResCode.invalidData,
                        ResMessage.invalidBody,
                    );
                    return;
                }

                const user = updateUser({
                    id: id,
                    username: userData.username,
                    age: userData.age,
                    hobbies: userData.hobbies,
                });

                if (user) {
                    sendResponse(res, ResCode.success, user);
                    return;
                }

                const newUser = addUser({
                    id: id,
                    username: userData.username,
                    age: userData.age,
                    hobbies: userData.hobbies,
                });

                if (newUser) {
                    sendResponse(res, ResCode.created, newUser);
                    return;
                }
            });

            return;
        }

        if (req.method === 'DELETE') {
            if (deleteUser(id)) {
                sendResponse(res, ResCode.deleted);
                return;
            }
        }

        sendResponse(res, ResCode.notFound, ResMessage.userNotFound);
        return;
    }

    sendResponse(res, ResCode.notFound, ResMessage.resourseNotFound);
};

export default requestListener;
