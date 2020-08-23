FROM node:12.18.3-slim

#Configurar TimeZone - Recife
ENV TZ=America/Recife
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /rss-bfb-ms-common
COPY rss-bfb-ms-common/package.json .
RUN npm install --only=prod && npm cache clean --force
COPY rss-bfb-ms-common .

WORKDIR /app
COPY rss-bfb-ms-book/package.json .
RUN npm install --only=prod && npm cache clean --force
COPY rss-bfb-ms-book .

CMD ["npm", "start"]