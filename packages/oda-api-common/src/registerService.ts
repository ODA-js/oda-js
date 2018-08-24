import httpProxy from 'http-proxy';
import * as url from 'url';

const serviceProviderList = [];

export function registerServiceProvider(api) {
  serviceProviderList.push(api);
}

function useStatics(server, api) {
  let host = `http://${api.binding.host}:${api.binding.port}`;
  for (let i = 0, len = api.statics.length; i < len; i++) {
    server.use(api.statics[i].route, (req, res) => {
      res.redirect(url.resolve(host, req.originalUrl));
    });
    // server.use(api.statics[i].route, Express.static(api.statics[i].path));
  }
}

// пересмотреть, чтобы использовать один прокси на всех.... а не несколько...
function useProxy(server, api) {
  const { binding } = api;
  const targetUrl = `http://${binding.host}:${binding.port}`;

  const proxy = httpProxy.createProxyServer({
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

  // added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
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

  proxy.on('proxyReq', function(proxyReq, req, res, options) {
    proxyReq.setHeader('x-forwarded-for', req.ip);
  });
}

export function injectServiceProvider(server) {
  // use proxy
  for (let i = 0, len = serviceProviderList.length; i < len; i++) {
    useStatics(server, serviceProviderList[i]);
    useProxy(server, serviceProviderList[i]);
  }
}
