// Local visual QA only: block generated video while serving the actual UI.
// No request, cookie, or credential reaches the real backend.
import http from 'node:http';
http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    res.writeHead(401, {'Content-Type':'application/json'});
    res.end('{"detail":"No session in media failure fixture"}');
    return;
  }
  if (req.url.includes('/g2/g23/hardware/copper-motion-960.mp4')) {
    res.writeHead(503, {'Content-Type':'text/plain'});
    res.end('Intentional local media failure');
    return;
  }
  http.get({hostname:'127.0.0.1',port:5173,path:req.url}, upstream => {
    res.writeHead(upstream.statusCode || 502, upstream.headers);
    upstream.pipe(res);
  }).on('error', () => {res.writeHead(502);res.end('Local development server unavailable');});
}).listen(5191,'127.0.0.1',() => console.log('Isolated media failure fixture: http://127.0.0.1:5191'));
