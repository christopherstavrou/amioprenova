/**
 * Cloudflare Pages edge middleware.
 *
 * Redirects /en/* and /bg/* → / on the live production domain only.
 * Branch-preview URLs (*.pages.dev) and localhost pass through untouched,
 * so work-in-progress builds remain fully browsable.
 */

const PRODUCTION_HOSTNAMES = new Set(['amioprenova.com', 'www.amioprenova.com']);

interface PagesFunctionContext {
  request: Request;
  next: () => Promise<Response>;
}

export const onRequest = async ({ request, next }: PagesFunctionContext): Promise<Response> => {
  const { hostname, pathname } = new URL(request.url);

  if (
    PRODUCTION_HOSTNAMES.has(hostname) &&
    (pathname.startsWith('/en/') || pathname.startsWith('/bg/'))
  ) {
    return Response.redirect(new URL('/', request.url), 302);
  }

  return next();
};
