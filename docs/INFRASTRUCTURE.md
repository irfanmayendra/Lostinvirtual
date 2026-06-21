# LostInVirtual Infrastructure Overview

## Environment Routing
All services are proxied via Nginx Proxy Manager (NPM).

| Domain | Environment | Host Port |
| :--- | :--- | :--- |
| `prod.lostinvirtual.world` | Production | 3000 |
| `staging.lostinvirtual.world` | Staging | 3002 |
| `dev.lostinvirtual.world` | Development | 3001 |

## Authentication (Keycloak)
- **Issuer:** `https://keycloak.lostinvirtual.world/realms/lostinvirtual`
- **Mechanism:** NextAuth OIDC Provider.
- **Middleware:** Route `/app/*` is protected and requires valid Keycloak session.

## CI/CD Pipeline
- **Trigger:** Push to `main` or `staging`.
- **Workflow:** CI runs `npm install` -> `npm run lint` -> `npm run build` (via Turbo).
