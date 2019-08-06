"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_proxy_1 = __importDefault(require("http-proxy"));
const url_1 = __importDefault(require("url"));
const serviceProviderList = [];
function registerServiceProvider(api) {
    serviceProviderList.push(api);
}
exports.registerServiceProvider = registerServiceProvider;
function useStatics(server, api) {
    let host = `http://${api.binding.host}:${api.binding.port}`;
    for (let i = 0, len = api.statics.length; i < len; i++) {
        server.use(api.statics[i].route, (req, res) => {
            res.redirect(url_1.default.resolve(host, req.originalUrl));
        });
    }
}
function useProxy(server, api) {
    const { binding } = api;
    const targetUrl = `http://${binding.host}:${binding.port}`;
    const proxy = http_proxy_1.default.createProxyServer({
        target: targetUrl,
        ws: true,
    });
    for (let i = 0, urlList = api.urls, len = urlList.length; i < len; i++) {
        let _url = urlList[i];
        if (typeof _url === 'string') {
            _url = {
                src: _url,
                dst: _url,
            };
        }
        server.use(_url.src, (req, res) => {
            proxy.web(req, res, {
                target: targetUrl + _url.dst,
            });
        });
    }
    proxy.on('error', (error, req, res) => {
        if (error.code !== 'ECONNRESET') {
            console.error('proxy error', error);
        }
        if (!res.headersSent) {
            res.writeHead(500, { 'content-type': 'application/json' });
        }
        let json = { error: 'proxy_error', reason: error.message };
        res.end(JSON.stringify(json));
    });
    proxy.on('proxyReq', function (proxyReq, req, res, options) {
        proxyReq.setHeader('x-forwarded-for', req.ip);
    });
}
function injectServiceProvider(server) {
    for (let i = 0, len = serviceProviderList.length; i < len; i++) {
        useStatics(server, serviceProviderList[i]);
        useProxy(server, serviceProviderList[i]);
    }
}
exports.injectServiceProvider = injectServiceProvider;
//# sourceMappingURL=registerService.js.map