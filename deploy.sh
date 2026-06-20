#!/bin/bash
set -e

# Deploy por TAG â€” mesmo padrao do freecontrol
# Porta: 3006 | Container: site-grupoalvim

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

CONTAINER_NAME="${CONTAINER_NAME:-site-grupoalvim}"
IMAGE_NAME="${IMAGE_NAME:-grupoalvim/site}"
APP_PORT="3006"
DEPLOY_DIR="/var/www/app/.site-grupoalvim-deploy"

if [ -f .env ] && grep -qE '^PORT=' .env; then
  APP_PORT="$(grep -E '^PORT=' .env | head -1 | cut -d= -f2- | tr -d '[:space:]"')"
fi

mkdir -p "$DEPLOY_DIR"
cp -f deploy.sh Dockerfile .dockerignore "$DEPLOY_DIR/" 2>/dev/null || true

echo ""
echo "====================================="
echo " Deploy Site Grupo Alvim (por TAG)"
echo " Porta: ${APP_PORT}"
echo "====================================="
echo ""

echo "Atualizando tags..."
git fetch --tags

LATEST_TAG=$(git tag --sort=v:refname | tail -n 1)

echo ""
echo "Ultima versao disponivel: ${LATEST_TAG}"
echo ""
echo "Tags disponiveis:"
git tag --sort=v:refname -n

echo ""

if [ -n "${TAG:-}" ]; then
  echo "Tag informada via variavel: ${TAG}"
else
  while true; do
    read -r -p "Digite a tag para deploy (ex: ${LATEST_TAG}): " TAG

    if [ -z "$TAG" ]; then
      echo "Nenhuma tag informada!"
      echo ""
      continue
    fi

    if git rev-parse "refs/tags/$TAG" >/dev/null 2>&1; then
      break
    fi

    echo ""
    echo "A versao ${TAG} nao existe!"
    echo ""
    echo "Tags disponiveis:"
    git tag --sort=v:refname -n
    echo ""
  done
fi

if ! git rev-parse "refs/tags/$TAG" >/dev/null 2>&1; then
  echo "ERRO: tag invalida: ${TAG}"
  exit 1
fi

echo ""
echo "Iniciando deploy da versao: ${TAG}"
echo "(detached HEAD e normal ao fazer deploy por tag)"
echo ""

git -c advice.detachedHead=false checkout "tags/${TAG}" -f

# Usa Dockerfile/.dockerignore atuais (tags antigas tinham Dockerfile quebrado)
if [ -f "$DEPLOY_DIR/Dockerfile" ]; then
  cp -f "$DEPLOY_DIR/Dockerfile" "$DEPLOY_DIR/.dockerignore" "$SCRIPT_DIR/"
fi
cp -f "$DEPLOY_DIR/deploy.sh" "$SCRIPT_DIR/deploy.sh" 2>/dev/null || true
chmod +x "$SCRIPT_DIR/deploy.sh" 2>/dev/null || true

if [ ! -f .env ]; then
  echo "ERRO: .env nao encontrado em ${SCRIPT_DIR}"
  exit 1
fi

echo ""
echo "Build Docker..."

docker stop "${CONTAINER_NAME}" 2>/dev/null || true
docker rm "${CONTAINER_NAME}" 2>/dev/null || true

docker build --no-cache -t "${IMAGE_NAME}:${TAG}" -t "${IMAGE_NAME}:latest" .

docker run -d \
  -p "${APP_PORT}:${APP_PORT}" \
  -e "PORT=${APP_PORT}" \
  -e "NODE_ENV=production" \
  --env-file .env \
  --name "${CONTAINER_NAME}" \
  --restart unless-stopped \
  "${IMAGE_NAME}:${TAG}"

echo ""
echo "Aguardando aplicacao..."

for i in $(seq 1 15); do
  if curl -fsS "http://127.0.0.1:${APP_PORT}/" >/dev/null 2>&1; then
    echo ""
    echo "====================================="
    echo " Deploy concluido com sucesso!"
    echo " Versao: ${TAG}"
    echo " Porta:  ${APP_PORT}"
    echo " URL:    https://www.grupoalvim.com.br"
    echo "====================================="
    docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "Reiniciando nginx..."
    sudo systemctl restart nginx 2>/dev/null || sudo systemctl reload nginx 2>/dev/null || true
    exit 0
  fi
  sleep 2
done

echo ""
echo "ERRO: aplicacao nao respondeu na porta ${APP_PORT}"
docker logs --tail 30 "${CONTAINER_NAME}" 2>&1 || true
exit 1
