const https = require('https');
const path = require('path');
const FormData = require('form-data');
const fs = require('fs-extra');


function getFormData(pagename) {
  const form = new FormData();
  form.append('file', fs.createReadStream(path.resolve(__dirname, `../swagger-ui/jsons/${pagename}.json`)));
  form.append('moduleName', 'COMMENT-APIDOC');
  return form;
}

function uploadFiles(pagename) {
  const form = getFormData(pagename);
  const options = {
    method: 'POST',
    host: 'newbase.zhihuishu.com',
    path: '/upload/commonUploadFile',
    protocol: 'https:',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
      'Connection': 'keep-alive'
    }
  };

  const req = https.request(options);

  form.pipe(req);

  req.on('response', function(res) {
    let chunks = Buffer.from([]);
    res.on('data', (chunk) => {
      chunks = Buffer.concat([chunks, chunk]);
      console.log(`响应主体: ${chunk}`);
    });
    res.on('end', () => {
      const data = JSON.parse(chunks.toString('utf-8'));
      if(data.status === '200') {
        const fileId = data.rt.fileId;
        const prevewUrl = encodeURIComponent(`https://commentdoc.zhihuishu.com?id=${fileId}`);
        console.log('文件预览地址:', prevewUrl);
        console.log('本地备份一下，请勿多次发布');
      }
      
      // 查询swagger地址
      // commentdoc.zhihuishu.com
      // https://commentdoc.zhihuishu.com?jsonUrl=
      console.log(data,'就是我们接收到的响应')
    });
  });
}
module.exports = uploadFiles;
