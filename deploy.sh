#!/usr/bin/env bash
set -euo pipefail

# Deploy do site Grupo Alvim em container Docker
# Produção: https://www.grupoalvim.com.br (porta 3006)

IMAGE_NAME="grupoalvim/site"
CONTAINER_NAME="site-grupoalvim"
HOST_PORT="3006"
CONTAINER_PORT="3006"
SITE_URL="https://www.grupoalvim.com.br"
ENV_FILE=".env"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

log() {
  echo "[deploy] $*"
}

fail() {
  echo "[deploy] ERRO: $*" >&2
  exit 1
}

command -v docker >/dev/null 2>&1 || fail "Docker não encontrado. Instale o Docker antes de continuar."

if [[ ! -f "$ENV_FILE" ]]; then
  fail "Arquivo $ENV_FILE não encontrado. Copie .env.example para .env e configure as credenciais SMTP."
fi

log "Diretório: $SCRIPT_DIR"
log "Site: $SITE_URL"
log "Porta: $HOST_PORT"

if [[ -d .git ]]; then
  log "Atualizando código (git pull)..."
  git pull --ff-only
fi

log "Construindo imagem Docker: $IMAGE_NAME"
docker build -t "$IMAGE_NAME:latest" .

if docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
  log "Parando container existente: $CONTAINER_NAME"
  docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
  docker rm "$CONTAINER_NAME" >/dev/null 2>&1 || true
fi

log "Iniciando container: $CONTAINER_NAME"
docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  --env-file "$ENV_FILE" \
  -e NODE_ENV=production \
  -e PORT="$CONTAINER_PORT" \
  "$IMAGE_NAME:latest"

log "Aguardando aplicação responder..."
for i in $(seq 1 15); do
  if curl -fsS "http://127.0.0.1:${HOST_PORT}/" >/dev/null 2>&1; then
    log "Aplicação online em http://127.0.0.1:${HOST_PORT}"
    log "Configure o proxy reverso (Nginx/Caddy) para apontar $SITE_URL -> localhost:${HOST_PORT}"
    docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    exit 0
  fi
  sleep 2
done

log "Container iniciado, mas o health check não respondeu a tempo."
log "Verifique os logs: docker logs -f $CONTAINER_NAME"
docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
exit 1
