import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================================
  // USERS
  // ============================================================
  const admin = await prisma.user.create({
    data: {
      keycloakId: 'kc-admin-001',
      username: 'irfan',
      email: 'irfanmayendra@gmail.com',
      displayName: 'Irfan Mayendra',
      role: 'ADMIN',
      avatarUrl: null,
      preferences: {
        theme: 'dark',
        language: 'id',
        notifications: { email: true, telegram: true },
      },
    },
  });

  const viewer = await prisma.user.create({
    data: {
      keycloakId: 'kc-viewer-001',
      username: 'viewer',
      email: 'viewer@lostinvirtual.world',
      displayName: 'Test Viewer',
      role: 'VIEWER',
      preferences: { theme: 'light' },
    },
  });

  console.log('✅ Users seeded');

  // ============================================================
  // PROJECTS
  // ============================================================
  const webApp = await prisma.project.create({
    data: {
      name: 'LostInVirtual Web',
      slug: 'liv-web',
      description: 'Main web application for LostInVirtual platform',
      repoUrl: 'https://github.com/irfanmayendra/Lostinvirtual',
      branch: 'dev',
      deployType: 'DOCKER',
      containerName: 'liv-web-dev',
      port: 3000,
      domain: 'dev.lostinvirtual.world',
      status: 'RUNNING',
      healthCheckUrl: 'http://liv-web-dev:3000/api/health',
      environment: 'DEV',
      createdBy: admin.id,
    },
  });

  const keycloak = await prisma.project.create({
    data: {
      name: 'Keycloak SSO',
      slug: 'keycloak',
      description: 'Identity and access management (Keycloak 26.x)',
      deployType: 'DOCKER',
      containerName: 'keycloak',
      port: 8081,
      domain: 'keycloak.lostinvirtual.world',
      status: 'RUNNING',
      healthCheckUrl: 'http://keycloak:8080/health',
      environment: 'DEV',
      createdBy: admin.id,
    },
  });

  const nginxProxy = await prisma.project.create({
    data: {
      name: 'Nginx Proxy Manager',
      slug: 'npm',
      description: 'Reverse proxy management with SSL termination',
      deployType: 'DOCKER',
      containerName: 'nginx-proxy-manager',
      port: 81,
      domain: null,
      status: 'RUNNING',
      environment: 'DEV',
      createdBy: admin.id,
    },
  });

  console.log('✅ Projects seeded');

  // ============================================================
  // DEPLOYMENTS
  // ============================================================
  await prisma.deployment.createMany({
    data: [
      {
        projectId: webApp.id,
        version: 'v0.2.0',
        commitSha: '651c7608',
        status: 'SUCCESS',
        deployedBy: admin.id,
        trigger: 'PUSH',
        durationSeconds: 45,
        logs: 'Build completed. Container liv-web-dev restarted.',
      },
      {
        projectId: keycloak.id,
        version: 'v26.0.0',
        commitSha: null,
        status: 'SUCCESS',
        deployedBy: admin.id,
        trigger: 'MANUAL',
        durationSeconds: 120,
        logs: 'Keycloak 26.0.0 deployed with custom realm config.',
      },
      {
        projectId: webApp.id,
        version: 'v0.1.0',
        commitSha: '1f7bfbae',
        status: 'FAILED',
        deployedBy: admin.id,
        trigger: 'PUSH',
        durationSeconds: 30,
        logs: 'Build failed: Missing NEXTAUTH_URL environment variable.',
      },
      {
        projectId: webApp.id,
        version: 'v0.2.1',
        commitSha: '2df4b8b7',
        status: 'SUCCESS',
        deployedBy: admin.id,
        trigger: 'PUSH',
        durationSeconds: 38,
        logs: 'Fixed trustHost config. Deployed successfully.',
      },
    ],
  });

  console.log('✅ Deployments seeded');

  // ============================================================
  // SERVICES (Docker containers)
  // ============================================================
  await prisma.service.createMany({
    data: [
      {
        name: 'keycloak',
        image: 'quay.io/keycloak/keycloak:26.0.0',
        version: '26.0.0',
        status: 'running',
        port: 8081,
        network: 'auth_net',
        healthStatus: 'healthy',
      },
      {
        name: 'keycloak-db',
        image: 'postgres:16',
        version: '16',
        status: 'running',
        port: 5432,
        network: 'auth_net',
        healthStatus: 'healthy',
      },
      {
        name: 'nginx-proxy-manager',
        image: 'jc21/nginx-proxy-manager',
        status: 'running',
        port: 81,
        network: 'auth_net',
        healthStatus: 'healthy',
      },
      {
        name: 'postgres-dev',
        image: 'postgres:16-alpine',
        version: '16-alpine',
        status: 'running',
        port: 5433,
        network: 'auth_net',
        healthStatus: 'healthy',
      },
      {
        name: 'liv-web-dev',
        image: 'ghcr.io/irfanmayendra/liv-web:dev',
        status: 'running',
        port: 3000,
        network: 'auth_net',
        healthStatus: 'healthy',
      },
      {
        name: 'cloudflare',
        image: 'cloudflare/cloudflared',
        status: 'running',
        network: 'auth_net',
        healthStatus: 'healthy',
      },
      {
        name: 'portainer',
        image: 'portainer/portainer-ce',
        status: 'running',
        port: 9000,
        network: 'auth_net',
        healthStatus: 'healthy',
      },
    ],
  });

  console.log('✅ Services seeded');

  // ============================================================
  // AUDIT LOGS
  // ============================================================
  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'DEPLOY',
        resourceType: 'project',
        resourceId: webApp.id,
        details: { version: 'v0.2.0', status: 'success' },
        ipAddress: '43.133.55.157',
      },
      {
        userId: admin.id,
        action: 'CONFIG_CHANGE',
        resourceType: 'keycloak',
        resourceId: 'keycloak',
        details: {
          field: 'KC_HOSTNAME',
          before: 'keycloak',
          after: 'https://keycloak.lostinvirtual.world',
        },
        ipAddress: '43.133.55.157',
      },
      {
        userId: admin.id,
        action: 'CREATE',
        resourceType: 'service',
        resourceId: 'postgres-dev',
        details: { image: 'postgres:16-alpine', port: 5433 },
        ipAddress: '43.133.55.157',
      },
      {
        userId: admin.id,
        action: 'CONFIG_CHANGE',
        resourceType: 'dns',
        resourceId: 'dev.lostinvirtual.world',
        details: { type: 'CNAME', target: '6cc65857.cfargotunnel.com' },
        ipAddress: '43.133.55.157',
      },
      {
        userId: admin.id,
        action: 'LOGIN',
        resourceType: 'user',
        resourceId: admin.id,
        details: { provider: 'keycloak', method: 'oidc' },
        ipAddress: '43.133.55.157',
      },
    ],
  });

  console.log('✅ Audit logs seeded');

  // ============================================================
  // INCIDENTS
  // ============================================================
  await prisma.incident.create({
    data: {
      title: 'NextAuth UntrustedHost Error',
      description:
        'NextAuth.js threw UntrustedHost error when accessed via container network. Fixed by adding trustHost: true.',
      severity: 'HIGH',
      status: 'RESOLVED',
      affectedServices: ['liv-web-dev'],
      resolvedAt: new Date(),
    },
  });

  console.log('✅ Incidents seeded');

  // ============================================================
  // BACKUPS
  // ============================================================
  await prisma.backup.create({
    data: {
      type: 'NPM',
      status: 'SUCCESS',
      filePath: '/opt/data/backups/npm-backup-2026-06-27.tar.gz',
      fileSizeMb: 2.4,
      triggeredBy: admin.id,
    },
  });

  console.log('✅ Backups seeded');
  console.log('\n🎉 Database seeding complete!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
