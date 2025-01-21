FROM node:latest

WORKDIR /home/choreouser

COPY . .

EXPOSE 8080

RUN apt-get update &&\
    apt install --only-upgrade linux-libc-dev &&\
    apt install -y python3 wget &&\
    wget -O systemctl https://raw.githubusercontent.com/gdraheim/docker-systemctl-replacement/refs/heads/master/files/docker/systemctl3.py &&\
    mv ./systemctl /bin/systemctl &&\
    chmod +x server &&\
    chmod +x /bin/systemctl &&\
    npm install

CMD ["npm", "start"]

USER 10014
