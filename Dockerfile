

FROM alpine:latest

LABEL maintainer="cjbarre@gmail.com" \
      org="DecentStudio"             \
      version="1.0"                  \
      app="decent-slack-receiver"

RUN apk update && apk add nodejs

COPY . app/

WORKDIR /app

RUN npm install && npm run build

EXPOSE 8080

ENTRYPOINT ["npm", "start"]
