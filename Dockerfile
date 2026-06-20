FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY index.html termos.html privacidade.html ./
COPY assets ./assets/

ENV NODE_ENV=production
ENV PORT=3006

EXPOSE 3006

CMD ["node", "server.js"]
