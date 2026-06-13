import { Issuer } from 'openid-client';

let client: any;

export async function getClient() {
  if (client) return client;
  const keycloakIssuer = await Issuer.discover(
    'https://keycloak.lostinvirtual.world/realms/lostinvirtual'
  );
  client = new keycloakIssuer.Client({
    client_id: 'lostinvirtual-web',
    client_secret: process.env.KEYCLOAK_CLIENT_SECRET as string,
    redirect_uris: ['https://lostinvirtual.world/api/auth/callback'],
    response_types: ['code'],
  });
  return client;
}
