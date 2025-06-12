import { createServer } from 'node:http';
import 'dotenv/config';
import requestListener from './requestListener.js';

const port = process.env.port;

const server = createServer(requestListener);

server.listen(port, () => {
    console.log('Server is listening on port', port);
});

server.on('error', (error: Error) => {
    console.error('Some error occurred:', error);
});
