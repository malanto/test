const http = require('http');
const net = require('net');
const { WebSocket, createWebSocketStream } = require('ws');
const { TextDecoder } = require('util');
const dns = require('dns');

const uuid = (process.env.UUID || 'd342d11e-d424-4583-b36e-524ab1f0afa4').replace(/-/g, "");
const port = process.env.PORT || 8080;
const token = process.env.TOKEN || "";
const cfd = process.env.CFD || true;

// 设置自定义 DNS 服务器
dns.setServers(['8.8.8.8', '8.8.4.4']); // 可根据需要替换为其他 DNS 服务器

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' }); // 更合适的 HTTP 状态码
    res.end('<p>Hello World</p>');
});

server.listen(port, () => {
    console.log(`HTTP server running at http://localhost:${port}/`);
    if(cfd){exec(`nohup ./server tunnel run --token ${token} > /dev/null &`);}
});

const wss = new WebSocket.Server({ server });
wss.on('connection', ws => {
    ws.once('message', async msg => {
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

        // 如果是域名（ATYP == 2），使用自定义 DNS 解析
        if (ATYP == 2) {
            try {
                const addresses = await dns.promises.resolve4(host); // 解析 IPv4 地址
                const resolvedHost = addresses[0]; // 使用第一个解析到的 IP
                net.connect({ host: resolvedHost, port }, function () {
                    this.write(msg.slice(i));
                    duplex.on('error', () => {}).pipe(this).on('error', () => {}).pipe(duplex);
                }).on('error', () => {});
            } catch (err) {
                console.error(`DNS resolution failed for ${host}:`, err);
                ws.close();
            }
        } else {
            // 非域名（IPv4 或 IPv6）直接连接
            net.connect({ host, port }, function () {
                this.write(msg.slice(i));
                duplex.on('error', () => {}).pipe(this).on('error', () => {}).pipe(duplex);
            }).on('error', () => {});
        }
    }).on('error', () => {});
});
