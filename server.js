const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

// 加载环境变量
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const app = next({ 
  dev: false,
  dir: __dirname
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(8000, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log('Ready on http://0.0.0.0:8000');
    console.log('DeepSeek API Key configured:', process.env.DEEPSEEK_API_KEY ? 'Yes' : 'No');
  });
});
