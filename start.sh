# 后台运行 tunnel 服务
./server tunnel --edge-ip-version auto --no-autoupdate --protocol http2 run --token "eyJhIjoiZjcwNjZjZjc4YTgxMTJiNGZiNWI4OTE1M2VjMGE0YWIiLCJ0IjoiZDMwY2UzYzUtMWFhZC00NGJmLWEyYzEtYWYxNDY4ZDNiZTNkIiwicyI6Ik0yRTBNelZoT0RjdFpUQXhOeTAwTnprM0xUaGlZbVV0WTJGbU1XSXlaRFJtTm1NNSJ9" &

# 确保 server 启动后再运行 npm
sleep 2
npm start
