import uuidIsValid from './utils/uuidIsValid.js';
import { getUser, getUsers } from './data/users.js';
import { RequestListener, IncomingMessage, ServerResponse } from 'node:http';

const requestListener: RequestListener<
    typeof IncomingMessage,
    typeof ServerResponse
> = (req, res) => {
    let data;

    if (req.method === 'GET') {
        if (req.url === '/api/users') {
            data = getUsers();
        } else {
            const id = req.url?.split('/').at(-1);

            if (id && uuidIsValid(id)) {
                data = getUser(id);
            } else {
                res.writeHead(400, { 'Content-Type': 'text' });
                res.write('Not valid id (not uuid)');
                res.end();
                return;
            }

            if (!data) {
                res.writeHead(404, { 'Content-Type': 'text' });
                res.write(`Record with id=${id} does not exist`);
                res.end();
                return;
            }
        }
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

export default requestListener;
