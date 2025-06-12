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
            data = getUser('test');
        }
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
        JSON.stringify({
            data: data,
        }),
    );
};

export default requestListener;
