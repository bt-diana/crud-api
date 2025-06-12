import { createServer } from 'node:http';

const port = 3000;

const server = createServer();

server.listen(port, () => {
    console.log('Server is listening on port', port);
});

server.on('error', (error: Error) => {
    console.log('Error:', error);
});
