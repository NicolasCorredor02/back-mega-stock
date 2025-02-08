import createServer from './server/config/server.js';

const app = createServer();
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
