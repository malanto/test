FROM node:lts-alpine3.20

WORKDIR /home/choreouser

COPY . .

EXPOSE 8080

RUN npm install

CMD ["npm", "start"]

USER 10014
