FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# Gera CSS ou usa o site-custom.css ja commitado na tag
RUN if [ -f scripts/bundle-css.js ]; then \
      node scripts/bundle-css.js; \
    elif [ -s assets/site-custom.css ]; then \
      echo "Usando assets/site-custom.css"; \
    else \
      echo "ERRO: assets/site-custom.css ausente" && exit 1; \
    fi

ENV NODE_ENV=production
ENV PORT=3006

EXPOSE 3006

CMD ["node", "server.js"]
