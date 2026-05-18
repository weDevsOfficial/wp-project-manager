import { request, type APIRequestContext } from '@playwright/test';
import { Urls, Users, RestPaths } from './testData';

// Build authenticated nonce + cookie via wp-login + REST nonce endpoint.
// Lightweight helper — adds/removes fixture data through pm/v2 endpoints.
// Auth strategy: use Playwright request context with basic cookie auth after
// posting wp-login.php as admin.
export async function createAuthedContext(
  username: string = Users.adminUsername,
  password: string = Users.adminPassword,
): Promise<APIRequestContext> {
  const ctx = await request.newContext({
    baseURL: Urls.baseUrl,
    ignoreHTTPSErrors: true,
  });

  await ctx.post('/wp-login.php', {
    form: {
      log: username,
      pwd: password,
      'wp-submit': 'Log In',
      redirect_to: Urls.baseUrl + '/wp-admin/',
      testcookie: '1',
    },
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  });

  return ctx;
}

export async function fetchRestNonce(ctx: APIRequestContext): Promise<string> {
  // WP serves a REST nonce on admin pages in the global `wpApiSettings`.
  const res = await ctx.get('/wp-admin/admin-ajax.php?action=rest-nonce');
  if (res.ok()) {
    const nonce = (await res.text()).trim();
    if (nonce && nonce.length > 0 && nonce !== '0') return nonce;
  }
  // Fallback: scrape admin page for wpApiSettings.nonce.
  const admin = await ctx.get('/wp-admin/admin.php?page=pm_projects');
  const html = await admin.text();
  const m = html.match(/wpApiSettings[^}]*"nonce":"([a-f0-9]+)"/i);
  return m ? m[1] : '';
}

export interface PmProjectStub {
  id: number;
  title: string;
}

export async function createProject(
  ctx: APIRequestContext,
  nonce: string,
  title: string,
  description = '',
): Promise<PmProjectStub> {
  const res = await ctx.post(RestPaths.projects, {
    headers: { 'X-WP-Nonce': nonce, 'content-type': 'application/json' },
    data: { title, description, status: 'incomplete' },
  });
  if (!res.ok()) throw new Error(`createProject failed ${res.status()} ${await res.text()}`);
  const body = await res.json();
  const id = body?.data?.id ?? body?.id;
  return { id, title };
}

export async function deleteProject(
  ctx: APIRequestContext,
  nonce: string,
  id: number,
): Promise<void> {
  await ctx.delete(`${RestPaths.projects}/${id}`, {
    headers: { 'X-WP-Nonce': nonce },
  });
}

export async function listProjects(ctx: APIRequestContext, nonce: string): Promise<number[]> {
  const res = await ctx.get(`${RestPaths.projects}?per_page=100`, {
    headers: { 'X-WP-Nonce': nonce },
  });
  if (!res.ok()) return [];
  const body = await res.json();
  const rows = body?.data ?? body ?? [];
  return rows.map((r: { id: number }) => r.id);
}

export async function clearAllProjects(ctx: APIRequestContext, nonce: string): Promise<void> {
  const ids = await listProjects(ctx, nonce);
  for (const id of ids) {
    await deleteProject(ctx, nonce, id);
  }
}
