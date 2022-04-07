"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrl2RegexGroup = exports.Express = exports.createServerFunc = void 0;
const http_1 = require("http");
class Express {
    constructor() {
    }
    createServer() {
        let routeTable = [];
        let registerPath = this.registerPath;
        let that = this;
        const server = (0, http_1.createServer)(async (request, response) => {
            let { url = '/', method = 'get' } = request;
            method = method.toLowerCase();
            let match = false;
            for (let i = 0; i < routeTable.length; i++) {
                let route = routeTable[i];
                const path = parseUrl2RegexGroup(route.path);
                if (new RegExp(path).test(url) && route[method]) {
                    let callback = route[method];
                    let middeware = route[`${method}-middeware`];
                    const regMatch = url.match(new RegExp(path));
                    let params = regMatch === null || regMatch === void 0 ? void 0 : regMatch.groups;
                    let query = parseUrlQueryParams(url);
                    let body = await this.readBody(request);
                    let mergeResponse = Object.assign(response, { params, query, body });
                    ;
                    let result = await this.processMiddleware(middeware, request, this.createResponse(mergeResponse));
                    if (result) {
                        callback(request, mergeResponse);
                    }
                    match = true;
                    break;
                }
            }
            if (!match) {
                response.statusCode = 404;
                response.end('Not Found 404', 'utf-8');
            }
        });
        return {
            server,
            get: (path, ...rest) => {
                let [middleware, callback] = rest;
                if (callback) {
                    registerPath(routeTable, path, 'get', callback, middleware);
                }
                else {
                    registerPath(routeTable, path, 'get', middleware);
                }
            },
            post: (path, ...rest) => {
                let [middleware, callback] = rest;
                if (callback) {
                    registerPath(routeTable, path, 'post', callback, middleware);
                }
                else {
                    registerPath(routeTable, path, 'post', middleware);
                }
            },
            put: (path, ...rest) => {
                let [middleware, callback] = rest;
                if (callback) {
                    registerPath(routeTable, path, 'post', callback, middleware);
                }
                else {
                    registerPath(routeTable, path, 'post', middleware);
                }
            },
            delete: (path, ...rest) => {
                let [middleware, callback] = rest;
                if (callback) {
                    this.registerPath(routeTable, path, 'post', callback, middleware);
                }
                else {
                    this.registerPath(routeTable, path, 'post', middleware);
                }
            }
        };
    }
    createResponse(res) {
        res['send'] = (message) => res.end(message);
        res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        };
        return res;
    }
    registerPath(routeTable, path, method, cb, middleware) {
        let len = routeTable.length;
        while (len > 0) {
            if (routeTable[len].path === path) {
                routeTable[len] = Object.assign(Object.assign({}, routeTable[len]), { [method]: cb, [`${method}-middleware`]: middleware });
            }
            len--;
        }
        if (len === 0) {
            routeTable.push({
                path,
                [method]: cb,
                [`${method}-middleware`]: middleware
            });
        }
    }
    async readBody(req) {
        let body = '';
        return new Promise((resolve, reject) => {
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                if (req.headers.accept === 'application/json') {
                    resolve(JSON.parse(body));
                }
                else {
                    resolve(body);
                }
            });
            req.on('error', (err) => {
                reject(err);
            });
        });
    }
    async processMiddleware(middleware, req, res) {
        if (!middleware) {
            return true;
        }
        return new Promise((resolve) => {
            middleware(req, res, function () {
                resolve(true);
            });
        });
    }
}
exports.Express = Express;
/**
 * @description set url regex group alias
 * @example /:id/ => /($<id>\\w+)/.match(url) => {groups: {id: 'xxx'}}
 * @param url
 * @returns
 */
function parseUrl2RegexGroup(url) {
    let str = '';
    let len = url.length;
    for (let i = 0; i < len; i++) {
        let char = url.charAt(i);
        if (char === ':') {
            let j = i + 1;
            while (j < len) {
                if (!/\w/.test(url.charAt(j))) {
                    break;
                }
                j++;
            }
            let name = url.substring(i + 1, j);
            str += `(?<${name}>\\w+)`;
            i = j;
        }
        else {
            str += char;
        }
    }
    return str;
}
exports.parseUrl2RegexGroup = parseUrl2RegexGroup;
function parseUrlQueryParams(url) {
    let result = url.match(/\?(?<query>.*)/);
    if (!result) {
        return {};
    }
    const { groups: { query } } = result;
    const pairs = query.match(/(?<param>\w+)=(?<value>\w+)/g);
    const params = pairs.reduce;
    return {};
}
let createServerFunc = new Express().createServer;
exports.createServerFunc = createServerFunc;
