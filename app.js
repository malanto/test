const http = require('http'); 
const net = require('net');
const { WebSocket, createWebSocketStream } = require('ws');
const { TextDecoder } = require('util');
const { exec } = require('child_process');

const uuid = (process.env.UUID || 'd342d11e-d424-4583-b36e-524ab1f0afa4').replace(/-/g, "");
const port = process.env.PORT || 8080;
const ARGO_AUTH = process.env.ARGO_AUTH || 'eyJhIjoiZjcwNjZjZjc4YTgxMTJiNGZiNWI4OTE1M2VjMGE0YWIiLCJ0IjoiMGFhMzNhMGUtZWU2ZS00N2I4LTk4OWYtNDhhMTJkN2M1ZTUxIiwicyI6Ik4yUm1ObUZsWkdVdE5qYzNOeTAwTW1KakxUZzFPR1l0WWpCaVptWXdaV015TW1WbSJ9';

// run-xr-ay
function runWeb() {
    setTimeout(() => {
        runServer();
    }, 2000);
}

// run-server
function runServer() {
    let command = ''; 
    if (ARGO_AUTH.match(/^[A-Z0-9a-z=]{120,250}$/)) {
        command = `nohup ./server tunnel --edge-ip-version auto --no-autoupdate --protocol http2 run --token ${ARGO_AUTH} >/dev/null 2>&1 &`; 
    } else {
        command = `nohup ./server tunnel --edge-ip-version auto --config tunnel.yml run >/dev/null 2>&1 &`; 
    }

    exec(command, (error) => { 
        if (error) {
            console.error(`server running error: ${error}`);
        } else {
            console.log('server is running');
        }
    });
}

const server = http.createServer((req, res) => {
    if (req.url === '/start' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Server starting...');
        runWeb();
    } else {
        res.writeHead(405, { 'Content-Type': 'text/html' });
        res.end(`<h1>Method Not Allowed</h1>
<p>The method is not allowed for the requested URL.</p>`);
    }
});

server.listen(port, () => { 
    console.log(`HTTP server running at http://localhost:${port}/`);
});

const wss = new WebSocket.Server({ server }); 

wss.on('connection', ws => {
    ws.once('message', msg => {
        const [VERSION] = msg;
        const id = msg.slice(1, 17);
        if (!id.every((v, i) => v == parseInt(uuid.substr(i * 2, 2), 16))) return;
        let i = msg.slice(17, 18).readUInt8() + 19;
        const port = msg.slice(i, i += 2).readUInt16BE(0);
        const ATYP = msg.slice(i, i += 1).readUInt8();
        const host = ATYP == 1 ? msg.slice(i, i += 4).join('.') :
            (ATYP == 2 ? new TextDecoder().decode(msg.slice(i + 1, i += 1 + msg.slice(i, i + 1).readUInt8())) :
                (ATYP == 3 ? msg.slice(i, i += 16).reduce((s, b, i, a) => (i % 2 ? s.concat(a.slice(i - 1, i + 1)) : s), []).map(b => b.readUInt16BE(0).toString(16)).join(':') : ''));

        ws.send(new Uint8Array([VERSION, 0]));
        const duplex = createWebSocketStream(ws);
        net.connect({ host, port }, function () {
            this.write(msg.slice(i));
            duplex.on('error', () => {}).pipe(this).on('error', () => {}).pipe(duplex);
        }).on('error', () => {});
    }).on('error', () => {});
});
