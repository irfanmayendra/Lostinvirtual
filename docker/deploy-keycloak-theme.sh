#!/usr/bin/env bash
# ================================================================
# LostInVirtual — Deploy Keycloak Theme
# Copies custom CSS to Keycloak container and updates realm settings.
# ================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KEYCLOAK_CONTAINER="keycloak"
KEYCLOAK_URL="http://localhost:8081"
REALM="lostinvirtual"
THEME_CSS="${SCRIPT_DIR}/keycloak-theme/lostinvirtual.css"
THEME_DIR="/opt/keycloak/themes/lostinvirtual/login"
THEME_CSS_DIR="${THEME_DIR}/css"

echo "============================================"
echo "  LostInVirtual — Keycloak Theme Deploy"
echo "============================================"
echo ""

# --- Step 1: Copy CSS into the Keycloak container ---
echo "[1/4] Copying theme CSS into Keycloak container..."
docker exec --user root "$KEYCLOAK_CONTAINER" mkdir -p "$THEME_CSS_DIR"
docker cp "$THEME_CSS" "${KEYCLOAK_CONTAINER}:${THEME_CSS_DIR}/lostinvirtual.css"

# Create theme.properties
docker exec --user root "$KEYCLOAK_CONTAINER" bash -c "cat > ${THEME_DIR}/theme.properties << 'PROPS'
parent=keycloak
styles=css/lostinvirtual.css
PROPS"

# Fix ownership and permissions
docker exec --user root "$KEYCLOAK_CONTAINER" chown -R 1000:0 "$THEME_DIR"
docker exec --user root "$KEYCLOAK_CONTAINER" chmod -R 644 "${THEME_CSS_DIR}/"
docker exec --user root "$KEYCLOAK_CONTAINER" chmod 644 "${THEME_DIR}/theme.properties"

echo "  Theme files installed at ${THEME_DIR}"

# --- Step 2: Verify files ---
echo ""
echo "[2/4] Verifying theme files..."
docker exec "$KEYCLOAK_CONTAINER" ls -la "${THEME_DIR}/theme.properties"
docker exec "$KEYCLOAK_CONTAINER" ls -la "${THEME_CSS_DIR}/lostinvirtual.css"

# --- Step 3: Get admin token and update realm ---
echo ""
echo "[3/4] Updating realm '${REALM}' theme settings..."

# Get admin password from docker env
KC_ADMIN_PASSWORD=$(docker inspect "$KEYCLOAK_CONTAINER" --format '{{range .Config.Env}}{{println .}}{{end}}' | grep '^KEYCLOAK_ADMIN_PASSWORD=' | cut -d= -f2-)

if [ -z "$KC_ADMIN_PASSWORD" ]; then
  echo "ERROR: Could not extract admin password from container env"
  exit 1
fi

# Get admin access token
TOKEN=$(curl -s -X POST "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin" \
  -d "password=${KC_ADMIN_PASSWORD}" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token',''))")

if [ -z "$TOKEN" ]; then
  echo "ERROR: Failed to obtain admin access token"
  exit 1
fi

# Update realm loginTheme and accountTheme
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X PUT \
  "${KEYCLOAK_URL}/admin/realms/${REALM}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"loginTheme":"lostinvirtual","accountTheme":"lostinvirtual"}')

if [ "$HTTP_CODE" = "204" ]; then
  echo "  Realm updated successfully"
else
  echo "  WARNING: Realm update returned HTTP ${HTTP_CODE}"
fi

# --- Step 4: Verify ---
echo ""
echo "[4/4] Verifying realm theme settings..."
curl -s "${KEYCLOAK_URL}/admin/realms/${REALM}" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -c "
import sys, json
r = json.load(sys.stdin)
print('  loginTheme:  ', r.get('loginTheme', '(not set)'))
print('  accountTheme:', r.get('accountTheme', '(not set)'))
"

echo ""
echo "============================================"
echo "  Deployment Complete"
echo "============================================"
echo ""
echo "  Theme:         lostinvirtual"
echo "  Realm:         ${REALM}"
echo "  CSS:           ${THEME_CSS_DIR}/lostinvirtual.css"
echo ""
echo "  Clear browser cache or use incognito to see changes."
echo "============================================"
