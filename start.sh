# 确保 npm 启动后再运行 server
npm start &
sleep 2
# 后台运行 tunnel 服务
./server tunnel --region us --edge-ip-version auto --no-autoupdate --protocol http2 run --token "eyJhIjoiZjcwNjZjZjc4YTgxMTJiNGZiNWI4OTE1M2VjMGE0YWIiLCJ0IjoiMGFhMzNhMGUtZWU2ZS00N2I4LTk4OWYtNDhhMTJkN2M1ZTUxIiwicyI6Ik4yUm1ObUZsWkdVdE5qYzNOeTAwTW1KakxUZzFPR1l0WWpCaVptWXdaV015TW1WbSJ9"
