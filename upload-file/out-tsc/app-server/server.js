"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const http_server_1 = require("./http-server");
const PORT = process.env['PORT'] || 4202;
const { server, get, post } = new http_server_1.Express().createServer();
get('/', (req, res) => {
    const filePath = (0, path_1.join)(process.cwd(), 'client/index.html');
    const html = (0, fs_1.readFileSync)(filePath);
    res.setHeader('Content-Type', 'html');
    res.end(html);
});
server.listen(PORT);
console.log(`Server running at http://127.0.0.1:${PORT}`);
