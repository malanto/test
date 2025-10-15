# 确保 npm 启动后再运行 server
npm start &
sleep 2
# 后台运行 tunnel 服务
./server tunnel --region us --edge-ip-version auto --no-autoupdate --protocol http2 run --token $TOKEN
