FROM node:alpine

LABEL maintainer="cjbarre@gmail.com" \
      org="DecentStudio"             \
      version="1.0"                  \
      app="decent-slack-receiver"

COPY . app/

WORKDIR /app

RUN npm install && npm run build

ENTRYPOINT ["npm", "start"]
