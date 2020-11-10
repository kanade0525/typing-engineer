// nodeのコアモジュールのhttpを使う
var http = require('http');
var server = http.createServer(RouteSetting);
var fs     = require('fs');
var ejs    = require('ejs');
const url = require('url');
const qs = require('qs');

var config = require('./config');

const indexPage = fs.readFileSync('/Users/k/Documents/GitHub/coda/public/index.ejs', 'utf-8');
const styleCss = fs.readFileSync('/Users/k/Documents/GitHub/coda/public/css/styles.css', 'utf-8');
const scriptJs = fs.readFileSync('/Users/k/Documents/GitHub/coda/public/js/main.js', 'utf-8');

function RouteSetting(req, res) {
  const url_parts = url.parse(req.url);
  switch (url_parts.pathname) {
    case '/':
    case '/index.ejs':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(indexPage);
      res.end();
      break;

    case '/css/styles.css':
    res.writeHead(200, {'Content-Type': 'text/css'});
    res.write(styleCss);
    res.end();
    break;

    case '/js/main.js':
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(scriptJs);
      res.end();
      break;

    default:
      //TODO: 文字化けする
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('404 NOT FOUND');
      break;
  }
}

server.listen(config.port);