const express = require('express');

const projectsRoutes = require('./projectsRoutes/projectsRoutes');
const actionsRoutes = require('./actionsRoutes/actionsRoutes');

const server = express();
const parser = express.json();
const PORT = 3000;

server.use(parser);
server.use('/projects', projectsRoutes);
server.use('/actions', actionsRoutes);

server.listen(PORT, ()=> {
    console.log(`The server is listening on port: ${PORT}`);
});