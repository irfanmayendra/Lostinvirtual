# Auth Documentation

## Keycloak Integration
The application uses `next-auth` with the Keycloak provider.

### Environment Variables
Ensure the following variables are set in your `.env` file:
- `KEYCLOAK_CLIENT_ID`: The client ID created in Keycloak realm.
- `KEYCLOAK_CLIENT_SECRET`: The client secret from Keycloak.
- `KEYCLOAK_ISSUER`: The OIDC issuer URL (e.g., `https://auth.lostinvirtual.com/realms/lostinvirtual`).
- `NEXTAUTH_URL`: The base URL of the web application.
- `NEXTAUTH_SECRET`: A random string for session encryption.

### Configuration
The provider is configured in `packages/auth/auth-options.ts`.
It automatically maps the `access_token` to the user session for API authorization.
