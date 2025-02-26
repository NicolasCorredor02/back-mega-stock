import serverUp from "root/config/server.js";

const server = serverUp();
const PORT = 8080;

server.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
