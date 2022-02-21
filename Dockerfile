FROM node:17.5

WORKDIR /server

COPY . ./

RUN npm install

EXPOSE 3000
EXPOSE 9229

CMD ["npm", "run", "start:dev"]
