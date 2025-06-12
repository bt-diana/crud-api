import { createServer } from 'node:http';
import 'dotenv/config';

const port = process.env.port;

const server = createServer();

server.listen(port, () => {
    console.log('Server is listening on port', port);
});

server.on('error', (error: Error) => {
    console.log('Error:', error);
});
