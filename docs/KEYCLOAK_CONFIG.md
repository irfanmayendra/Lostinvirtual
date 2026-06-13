---
name: lostinvirtual-keycloak-config
description: Infrastructure and Configuration guide for LostInVirtual Keycloak.
---

# Keycloak Deployment & Configuration (LostInVirtual)

## Infrastructure (Manual Docker)
- **Deployment:** Single manual Docker container (`keycloak`) on `auth_net` bridge network.
- **Why:** VPS lacks `docker-compose`. Do NOT attempt to install or use `docker-compose`.

## Configuration (via kcadm.sh)
- **Realm:** `lostinvirtual`
- **Clients:** `liv-app-dev`, `liv-app-staging`, `liv-app-prod`
- **Redirect URIs:** `https://lostinvirtual.world/*`

## Pitfalls
- **Persistent Storage:** Keycloak currently lacks persistent storage. A container restart will wipe Realm/Client configs. DO NOT improve this unless requested.
- **Warning:** Ignore "temporary admin user" warning.
- **Admin Creds:** Always `admin` / `irfan99`.
