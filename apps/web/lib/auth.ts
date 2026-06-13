import { Issuer } from 'openid-client';

const keycloakIssuer = await Issuer.discover(
  'https://keycloak.lostinvirtual.world/realms/lostinvirtual'
);

export const client = new keycloakIssuer.Client({
  client_id: 'lostinvirtual-web',
  client_secret: process.env.KEYCLOAK_CLIENT_SECRET as string,
  redirect_uris: ['https://lostinvirtual.world/api/auth/callback'],
  post_logout_redirect_uris: ['https://lostinvirtual.world/'],
});
