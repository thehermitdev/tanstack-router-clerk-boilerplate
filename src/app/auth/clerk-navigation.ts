import { router } from "#/app/router/router";

interface ClerkNavigationMetadata {
  windowNavigate: (to: string | URL) => void;
}

function resolveLocalHref(to: string): string | null {
  const target = new URL(to, window.location.href);

  if (target.origin !== window.location.origin) {
    return null;
  }

  return `${target.pathname}${target.search}${target.hash}`;
}

export function clerkRouterPush(to: string, metadata?: ClerkNavigationMetadata) {
  const localHref = resolveLocalHref(to);

  if (localHref) {
    router.history.push(localHref);
    return;
  }

  if (metadata) {
    metadata.windowNavigate(to);
    return;
  }

  window.location.assign(to);
}

export function clerkRouterReplace(to: string, metadata?: ClerkNavigationMetadata) {
  const localHref = resolveLocalHref(to);

  if (localHref) {
    router.history.replace(localHref);
    return;
  }

  if (metadata) {
    metadata.windowNavigate(to);
    return;
  }

  window.location.replace(to);
}
