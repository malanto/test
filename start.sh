# 确保 npm 启动后再运行 server
npm start &
sleep 2
# 后台运行 tunnel 服务
./server tunnel --region us --edge-ip-version auto --no-autoupdate --protocol http2 run --token "eyJhIjoiZjcwNjZjZjc4YTgxMTJiNGZiNWI4OTE1M2VjMGE0YWIiLCJ0IjoiOTA5ZDBjZTctNGVkZS00MDk1LTg0YTMtOTQxNjNkZWE1ZTM1IiwicyI6Ik9USXdaR1JtTjJVdE5HSTROaTAwTW1RMkxXRXlabUV0WkRJeE9UbGpNakJoT1RSbCJ9"
