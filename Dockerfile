FROM node:latest

WORKDIR /home/choreouser

COPY . .

EXPOSE 8080

RUN apt-get update &&\
    apt install --only-upgrade linux-libc-dev &&\
    npm install

CMD ["npm", "start"]

USER 10014
