const fs = require('fs-extra');
const path = require('path');

const contentTypeObj = {
  // 根据后缀名设置content-type值
  '.html': { "Content-Type": 'text/html;charset="utf-8"' },
  '.js': { "Content-Type": "text/javascript" },
  '.css': { "Content-Type": "text/css" },
  '.gif': { "Content-Type": "image/gif" },
  '.png': { "Content-Type": "image/png" },
};

const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, './keys/server.key')),
  cert: fs.readFileSync(path.resolve(__dirname,'./keys/server.crt'))
};

function staticController(req, res) {
  const staticRoot = path.resolve(__dirname, '../swagger-ui/static');
  const jsonRoot = path.resolve(__dirname, '../swagger-ui/jsons');
  
  if(req.url === '/') req.url = '/index.html';

  const pathname = req.url.slice(0, 6) === '/jsons' ? jsonRoot + req.url.slice(6) : staticRoot + req.url;
  console.log(pathname);
  fs.readFile(pathname, function (err,data) {
    if(err) {
      res.writeHead(404,{
        'Content-Type':'text/html'
      });
    } else {
      res.writeHead(200, contentTypeObj[path.extname(req.url)])
      res.write(data.toString());
    }
    res.end();
  });
}

module.exports = {
  staticController,
  httpsOptions,
};
