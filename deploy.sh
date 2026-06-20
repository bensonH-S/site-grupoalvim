#!/bin/bash
set -e

# Deploy por TAG - Site Grupo Alvim
#
# Arquitetura (configuracao unica, nao muda a cada deploy):
#   grupoalvim.conf (nginx) -> proxy_pass http://127.0.0.1:3006
#   deploy.sh -> build imagem + recria container na mesma porta 3006
#
# Voce NAO precisa:
#   - editar grupoalvim.conf a cada deploy
#   - rodar docker stop / docker rm manualmente (o script faz sozinho)
#   - reiniciar nginx (a porta 3006 continua a mesma)
#
# Porta FIXA: 3006 (nao usa PORT do .env para o mapeamento Docker)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

CONTAINER_NAME="${CONTAINER_NAME:-site-grupoalvim}"
IMAGE_NAME="${IMAGE_NAME:-grupoalvim/site}"
APP_PORT="3006"
DEPLOY_DIR="/var/www/app/.site-grupoalvim-deploy"

mkdir -p "$DEPLOY_DIR"
cp -f deploy.sh Dockerfile .dockerignore "$DEPLOY_DIR/" 2>/dev/null || true

log() {
  echo "[deploy] $*"
}

remove_container() {
  # Um unico comando: para e remove (necessario para carregar imagem nova)
  if docker ps -a --format '{{.Names}}' | grep -qx "${CONTAINER_NAME}"; then
    log "Atualizando container ${CONTAINER_NAME} (porta ${APP_PORT} inalterada)..."
    docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true
  fi
}

reload_nginx() {
  # Opcional â€” so se voce alterou o nginx. Com grupoalvim.conf ja configurado, nao precisa.
  if [ "${NGINX_RELOAD:-0}" = "1" ]; then
    if command -v systemctl >/dev/null 2>&1 && systemctl is-active --quiet nginx 2>/dev/null; then
      log "Reload nginx (NGINX_RELOAD=1)..."
      sudo systemctl reload nginx 2>/dev/null || sudo nginx -s reload 2>/dev/null || true
    fi
  fi
}

load_tags() {
  mapfile -t TAG_NAMES < <(git tag --sort=-v:refname)
  mapfile -t TAG_MESSAGES < <(git for-each-ref refs/tags --sort=-v:refname --format='%(subject)')
}

show_tags() {
  local i=0
  echo ""
  echo "Tags disponiveis (0 = mais recente):"
  while [ "$i" -lt "${#TAG_NAMES[@]}" ]; do
    local msg="${TAG_MESSAGES[$i]:-(sem descricao)}"
    printf "  [%s] %s - %s\n" "$i" "${TAG_NAMES[$i]}" "$msg"
    i=$((i + 1))
  done
  echo ""
}

echo ""
echo "====================================="
echo " Deploy Site Grupo Alvim (por TAG)"
echo " Porta: ${APP_PORT}"
echo "====================================="

log "Diretorio: ${SCRIPT_DIR}"
log "Site: https://www.grupoalvim.com.br"

echo ""
log "Atualizando tags..."
git fetch --tags

load_tags

if [ "${#TAG_NAMES[@]}" -eq 0 ]; then
  echo "ERRO: nenhuma tag encontrada."
  exit 1
fi

LATEST_TAG="${TAG_NAMES[0]}"
LATEST_MSG="${TAG_MESSAGES[0]:-(sem descricao)}"

echo ""
log "Ultima versao: ${LATEST_TAG} - ${LATEST_MSG}"
show_tags

if [ -n "${TAG:-}" ]; then
  log "Tag informada via variavel: ${TAG}"
else
  while true; do
    read -r -p "Digite o numero [0] ou a tag (ex: ${LATEST_TAG}): " INPUT

    if [ -z "$INPUT" ]; then
      INPUT="0"
    fi

    if [[ "$INPUT" =~ ^[0-9]+$ ]]; then
      if [ "$INPUT" -ge 0 ] && [ "$INPUT" -lt "${#TAG_NAMES[@]}" ]; then
        TAG="${TAG_NAMES[$INPUT]}"
        break
      fi
      echo ""
      echo "Numero invalido! Use 0 a $(( ${#TAG_NAMES[@]} - 1 ))."
      show_tags
      continue
    fi

    if git rev-parse "refs/tags/$INPUT" >/dev/null 2>&1; then
      TAG="$INPUT"
      break
    fi

    echo ""
    echo "Tag \"${INPUT}\" nao existe!"
    show_tags
  done
fi

if ! git rev-parse "refs/tags/$TAG" >/dev/null 2>&1; then
  echo "ERRO: tag invalida: ${TAG}"
  exit 1
fi

TAG_MSG="$(git tag -l --format='%(contents:subject)' "$TAG" 2>/dev/null || echo "")"

echo ""
log "Deploy da versao: ${TAG}"
[ -n "$TAG_MSG" ] && log "Descricao: ${TAG_MSG}"
echo "(detached HEAD e normal ao fazer deploy por tag)"
echo ""

git -c advice.detachedHead=false checkout "tags/${TAG}" -f

if [ -f "$DEPLOY_DIR/Dockerfile" ]; then
  cp -f "$DEPLOY_DIR/Dockerfile" "$DEPLOY_DIR/.dockerignore" "$SCRIPT_DIR/"
fi
cp -f "$DEPLOY_DIR/deploy.sh" "$SCRIPT_DIR/deploy.sh" 2>/dev/null || true
chmod +x "$SCRIPT_DIR/deploy.sh" 2>/dev/null || true

if [ ! -f .env ]; then
  echo "ERRO: .env nao encontrado em ${SCRIPT_DIR}"
  exit 1
fi

if grep -qE '^PORT=' .env && ! grep -qE '^PORT=3006' .env; then
  log "Aviso: .env tem PORT diferente de 3006 - deploy usa 3006 fixo para este site"
fi

log "Construindo imagem Docker: ${IMAGE_NAME} (tag ${TAG})"
log "Site continua no ar ate o build terminar..."

docker build --no-cache -t "${IMAGE_NAME}:${TAG}" -t "${IMAGE_NAME}:latest" .

remove_container

log "Subindo container na porta ${APP_PORT}..."

docker run -d \
  --name "${CONTAINER_NAME}" \
  --restart unless-stopped \
  -p "${APP_PORT}:${APP_PORT}" \
  --env-file .env \
  -e "PORT=${APP_PORT}" \
  -e "NODE_ENV=production" \
  "${IMAGE_NAME}:${TAG}"

log "Aguardando aplicacao..."

for i in $(seq 1 15); do
  if curl -fsS "http://127.0.0.1:${APP_PORT}/" >/dev/null 2>&1; then
    echo ""
    echo "====================================="
    echo " Deploy concluido com sucesso!"
    echo " Versao:    ${TAG}"
    [ -n "$TAG_MSG" ] && echo " Descricao: ${TAG_MSG}"
    echo " Porta:     ${APP_PORT} (nginx grupoalvim.conf -> localhost:${APP_PORT})"
    echo " URL:       https://www.grupoalvim.com.br"
    echo "====================================="
    echo ""
    echo "Nginx: nenhuma acao necessaria se grupoalvim.conf ja aponta para :${APP_PORT}"
    docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    reload_nginx
    exit 0
  fi
  sleep 2
done

echo ""
echo "ERRO: aplicacao nao respondeu na porta ${APP_PORT}"
docker logs --tail 30 "${CONTAINER_NAME}" 2>&1 || true
exit 1
