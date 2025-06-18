import type {
    RequestListener,
    ServerResponse,
    IncomingMessage,
} from 'node:http';
import sendResponse, { ResCode, ResMessage } from './sendResponse.js';
import { routes } from './routes.js';

const requestListener: RequestListener<
    typeof IncomingMessage,
    typeof ServerResponse
> = (req, res) => {
    try {
        const route = routes.find(
            ({ method, path }) =>
                req.method === method &&
                (typeof path === 'string'
                    ? req.url === path
                    : req.url?.match(path)),
        );

        if (route) {
            const params = {
                id:
                    route.path instanceof RegExp
                        ? [...req.url!.matchAll(route.path)].at(0)?.at(1)
                        : undefined,
            };

            route.handler(req, res, params);
        } else {
            sendResponse(res, ResCode.notFound, ResMessage.resourceNotFound);
        }
    } catch {
        sendResponse(res, ResCode.internalError, ResMessage.internalErorr);
    }
};

export default requestListener;
