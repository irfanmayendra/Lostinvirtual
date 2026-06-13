# LostInVirtual | Citizen Registry

The digital frontier's premier citizen registry. A sovereign ecosystem for identity, status, and community.

## Architecture
Built for agility, security, and scale.
- **Monorepo:** Next.js 16 (App Router), TypeScript, Tailwind CSS.
- **Environment Strategy:**
  - `main`: Production (Port 3001)
  - `staging`: UAT/Testing (Port 3002)
  - `develop`: Active Development (Port 3003)

## Workflow
1. Push to branch.
2. GitHub Actions triggers deploy to VPS.
3. Docker containers run per environment.

*Sovereign. Secure. Infinite.*
