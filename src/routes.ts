import sendResponse, { ResCode, ResMessage } from './sendResponse.js';
import {
    addUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
} from './data/users.js';
import type { ServerResponse, IncomingMessage } from 'node:http';
import idIsValid from './utils/idIsValid.js';
import getReqBody from './utils/getReqBody.js';
import userDataIsValid from './utils/userDataIsValid.js';

type Params = {
    id?: string;
};

const Endpoints = {
    users: '/api/users',
    user: /\/api\/users\/(.+)$/g,
} as const;

enum HTTPMethods {
    get = 'GET',
    post = 'POST',
    put = 'PUT',
    delete = 'DELETE',
}

type Route = {
    method: HTTPMethods;
    path: (typeof Endpoints)[keyof typeof Endpoints];
    handler: (
        req: IncomingMessage,
        res: ServerResponse,
        params: Params,
    ) => void;
};

const routes: Route[] = [
    {
        method: HTTPMethods.get,
        path: Endpoints.users,
        handler: (_, res) => {
            const users = getUsers();
            sendResponse(res, ResCode.success, users);
        },
    },
    {
        method: HTTPMethods.get,
        path: Endpoints.user,
        handler: (_, res, params) => {
            if (!params?.id || !idIsValid(params.id)) {
                sendResponse(res, ResCode.invalidData, ResMessage.invalidId);
            } else {
                const user = getUser(params.id);
                if (user) {
                    sendResponse(res, ResCode.success, user);
                } else {
                    sendResponse(
                        res,
                        ResCode.notFound,
                        ResMessage.userNotFound,
                    );
                }
            }
        },
    },
    {
        method: HTTPMethods.post,
        path: Endpoints.user,
        handler: (req, res, params) => {
            if (params.id && idIsValid(params.id)) {
                getReqBody(req).then((data: unknown) => {
                    if (userDataIsValid(data)) {
                        const user = addUser({
                            id: params.id!,
                            username: data.username,
                            age: data.age,
                            hobbies: data.hobbies,
                        });

                        sendResponse(res, ResCode.created, user);
                    } else {
                        sendResponse(
                            res,
                            ResCode.invalidData,
                            ResMessage.invalidBody,
                        );
                    }
                });
            } else {
                sendResponse(res, ResCode.invalidData, ResMessage.invalidId);
            }
        },
    },
    {
        method: HTTPMethods.put,
        path: Endpoints.user,
        handler: (req, res, params) => {
            if (params?.id && idIsValid(params.id)) {
                getReqBody(req).then((data: unknown) => {
                    if (userDataIsValid(data)) {
                        const userData = {
                            id: params.id!,
                            username: data.username,
                            age: data.age,
                            hobbies: data.hobbies,
                        };

                        const updatedUser = updateUser(userData);
                        if (updatedUser) {
                            sendResponse(res, ResCode.created, updatedUser);
                        } else {
                            const newUser = addUser(userData);
                            sendResponse(res, ResCode.created, newUser);
                        }
                    } else {
                        sendResponse(
                            res,
                            ResCode.invalidData,
                            ResMessage.invalidBody,
                        );
                    }
                });
            } else {
                sendResponse(res, ResCode.invalidData, ResMessage.invalidId);
            }
        },
    },
    {
        method: HTTPMethods.delete,
        path: Endpoints.user,
        handler: (_, res, params) => {
            if (!params?.id || !idIsValid(params.id)) {
                sendResponse(res, ResCode.invalidData, ResMessage.invalidId);
            } else {
                const deleted = deleteUser(params.id);

                if (deleted) {
                    sendResponse(res, ResCode.deleted);
                } else {
                    sendResponse(
                        res,
                        ResCode.notFound,
                        ResMessage.userNotFound,
                    );
                }
            }
        },
    },
];

export { routes };
