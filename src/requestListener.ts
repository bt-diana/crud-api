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

enum ResponseCode {
    success = 200,
    created = 201,
    deleted = 204,
    invalidData = 400,
    notFound = 404,
}

const sendResponse = (
    res: ServerResponse,
    code: ResponseCode,
    data: string | User | User[],
): void => {
    if (typeof data === 'string') {
        res.writeHead(code, { 'Content-Type': 'text' });
        res.end(data);
    } else {
        res.writeHead(code, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }
};

const requestListener: RequestListener<
    typeof IncomingMessage,
    typeof ServerResponse
> = (req, res) => {
    if (req.url === Endpoints.users) {
        if (req.method === 'GET') {
            sendResponse(res, ResponseCode.success, getUsers());
            return;
        }

        if (req.method === 'POST') {
            //TODO: create a new user
            return;
        }
    }

    if (req.url?.startsWith(Endpoints.users)) {
        const id = req.url.slice(Endpoints.users.length);

        if (!id || !uuidIsValid(id)) {
            sendResponse(
                res,
                ResponseCode.invalidData,
                'Not valid id (not uuid)',
            );
            return;
        }

        if (req.method === 'GET') {
            const user = getUser(id);
            if (user) {
                sendResponse(res, ResponseCode.success, user);
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

                const user = updateUser({
                    id: id,
                    username: userData.username,
                    age: userData.age,
                    hobbies: userData.hobbies,
                });

                if (user) {
                    sendResponse(res, ResponseCode.success, user);
                    return;
                }

                //TODO: create a new user if a user with corresponding id does not exist
            });

            return;
        }

        if (req.method === 'DELETE') {
            if (deleteUser(id)) {
                sendResponse(res, ResponseCode.deleted, 'Deleted succesfully');
                return;
            }
        }

        sendResponse(
            res,
            ResponseCode.notFound,
            `User with with id ${id} doesn't exist`,
        );
        return;
    }

    sendResponse(res, ResponseCode.notFound, `Resource does not exist`);
};

export default requestListener;
